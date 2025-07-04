-- CreateTable
CREATE TABLE "AuthRequest" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthRequest_publicKey_key" ON "AuthRequest"("publicKey");
