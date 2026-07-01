import { prisma } from '~/core/db/prisma'
import type { AuthUserPublicRecord, AuthUserRecord, VerifyTokenRecord } from './auth.type'

export class AuthRepository {
  public findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  }

  public async findUserForVerificationByEmail(
    email: string
  ): Promise<{ id: string; email: string; is_active: boolean; is_deleted: boolean } | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        is_active: true,
        is_deleted: true
      }
    })
  }

  public async updateLastLogin(userId: string, lastLoginAt: Date): Promise<AuthUserPublicRecord> {
    return await prisma.user.update({
      where: { id: userId },
      data: { last_login_at: lastLoginAt }
    })
  }

  public async createRefreshToken(data: {
    userId: string
    tokenHash: string
    expiresAt: Date
    userAgent?: string
    ipAddress?: string
  }): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress
      }
    })
  }

  public async revokeRefreshToken(tokenHash: string, revokedAt: Date): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null
      },
      data: { revokedAt }
    })
  }

  public async findVerifyTokenByHash(tokenHash: string): Promise<VerifyTokenRecord | null> {
    return await prisma.verifyToken.findUnique({
      where: { token_hash: tokenHash },
      select: {
        id: true,
        user_id: true,
        expires_at: true,
        used_at: true,
        user: {
          select: {
            id: true,
            is_active: true,
            is_deleted: true
          }
        }
      }
    })
  }

  public async activateUserByVerifyToken(tokenId: string, userId: string, usedAt: Date): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      const updatedToken = await tx.verifyToken.updateMany({
        where: {
          id: tokenId,
          used_at: null
        },
        data: { used_at: usedAt }
      })

      if (updatedToken.count === 0) {
        return false
      }

      await tx.user.update({
        where: { id: userId },
        data: { is_active: true }
      })

      return true
    })
  }

  public async createVerifyToken(data: {
    userId: string
    tokenHash: string
    redirectUrl?: string
    expiresAt: Date
    sentAt: Date
  }): Promise<void> {
    await prisma.$transaction([
      prisma.verifyToken.updateMany({
        where: {
          user_id: data.userId,
          used_at: null
        },
        data: { used_at: data.sentAt }
      }),
      prisma.verifyToken.create({
        data: {
          user_id: data.userId,
          token_hash: data.tokenHash,
          redirect_url: data.redirectUrl,
          expires_at: data.expiresAt,
          sent_count: 1,
          last_sent_at: data.sentAt
        }
      })
    ])
  }
}
