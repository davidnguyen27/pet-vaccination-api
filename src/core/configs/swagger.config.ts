import fs from 'node:fs'
import path from 'node:path'

import type { Express } from 'express'
import yaml from 'js-yaml'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerOptions: swaggerJsdoc.OAS3Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Pet Vaccination API',
      version: '1.0.0',
      description: 'API documentation for the Pet Vaccination Management System backend.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      parameters: {
        IdPath: {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          }
        },
        PageQuery: {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitQuery: {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        }
      },
      schemas: {
        PaginationResponseModel: {
          type: 'object',
          required: ['pageNum', 'pageSize', 'totalItems', 'totalPages'],
          properties: {
            pageNum: { type: 'integer' },
            pageSize: { type: 'integer' },
            totalItems: { type: 'integer' },
            totalPages: { type: 'integer' }
          }
        },
        ErrorResponse: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            errors: {}
          }
        },
        ValidationErrorResponse: {
          type: 'object',
          required: ['success', 'message', 'errors'],
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            errors: {
              type: 'object',
              required: ['formErrors', 'fieldErrors'],
              properties: {
                formErrors: {
                  type: 'array',
                  items: { type: 'string' }
                },
                fieldErrors: {
                  type: 'object',
                  additionalProperties: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['ADMIN', 'STAFF', 'VET', 'OWNER'] },
            is_active: { type: 'boolean' },
            is_deleted: { type: 'boolean' },
            full_name: { type: 'string', nullable: true },
            phone_number: { type: 'string', nullable: true },
            avatar_url: { type: 'string', nullable: true },
            dob: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true },
            last_login_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['ADMIN', 'STAFF', 'VET', 'OWNER'] },
            is_active: { type: 'boolean' },
            is_deleted: { type: 'boolean' },
            full_name: { type: 'string', nullable: true },
            phone_number: { type: 'string', nullable: true },
            avatar_url: { type: 'string', nullable: true },
            dob: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true },
            last_login_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        Species: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string', enum: ['DOG', 'CAT'] },
            name: { type: 'string', maxLength: 255 },
            default_vaccine_plan: { type: 'boolean' },
            is_deleted: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        ProfileUser: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['ADMIN', 'STAFF', 'VET', 'OWNER'] },
            full_name: { type: 'string', nullable: true },
            phone_number: { type: 'string', nullable: true },
            avatar_url: { type: 'string', nullable: true }
          }
        },
        OwnerProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            address: { type: 'string', nullable: true },
            location_lat: { type: 'number', nullable: true },
            location_lng: { type: 'number', nullable: true },
            total_points: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/ProfileUser' }
          }
        },
        StaffProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            code: { type: 'string' },
            job_title: { type: 'string', nullable: true },
            department: { type: 'string', nullable: true },
            employment_type: { type: 'string', enum: ['FULL_TIME', 'PART_TIME'] },
            employment_status: { type: 'string', enum: ['WORKING', 'ON_LEAVE'] },
            join_date: { type: 'string', format: 'date-time' },
            end_date: { type: 'string', format: 'date-time', nullable: true },
            address: { type: 'string' },
            citizen_id: { type: 'string' },
            notes: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/ProfileUser' }
          }
        },
        VetProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            bio: { type: 'string' },
            license_no: { type: 'string' },
            license_issue_by: { type: 'string' },
            license_valid_from: { type: 'string', format: 'date-time' },
            license_valid_to: { type: 'string', format: 'date-time' },
            join_date: { type: 'string', format: 'date-time' },
            end_date: { type: 'string', format: 'date-time', nullable: true },
            address: { type: 'string' },
            citizen_id: { type: 'string' },
            employment_status: { type: 'string', enum: ['WORKING', 'ON_LEAVE'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/ProfileUser' }
          }
        }
      },
      responses: {
        BadRequestError: {
          description: 'Bad request',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
        },
        UnauthorizedError: {
          description: 'Unauthorized',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
        },
        ForbiddenError: {
          description: 'Forbidden',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
        },
        NotFoundError: {
          description: 'Not found',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
        },
        ConflictError: {
          description: 'Conflict',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
        },
        ValidationError: {
          description: 'Validation failed',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Auth', description: 'Auth related endpoints' },
      { name: 'Users', description: 'Users related endpoints' },
      { name: 'Species', description: 'Species related endpoints' },
      { name: 'OwnerProfile', description: 'OwnerProfile related endpoints' },
      { name: 'StaffProfile', description: 'StaffProfile related endpoints' },
      { name: 'VetProfile', description: 'VetProfile related endpoints' }
    ]
  },
  apis: ['./src/modules/**/*.ts']
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)

if (process.env.NODE_ENV !== 'production') {
  const outputPath = path.resolve(process.cwd(), 'swagger.yaml')
  const swaggerYaml = yaml.dump(swaggerSpec, {
    noRefs: true,
    lineWidth: 120
  })

  try {
    fs.writeFileSync(outputPath, swaggerYaml, 'utf8')
    console.log(`Swagger YAML file generated at: ${outputPath}`)
  } catch (err) {
    console.error('Failed to generate swagger.yaml:', err)
  }
}

export const setupSwagger = (app: Express) => {
  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec)
  })

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
