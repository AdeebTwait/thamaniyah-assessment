-- CreateTable
CREATE TABLE "SearchResult" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SearchResult_query_key" ON "SearchResult"("query");

-- CreateIndex
CREATE INDEX "SearchResult_query_idx" ON "SearchResult"("query");

-- CreateIndex
CREATE INDEX "SearchResult_createdAt_idx" ON "SearchResult"("createdAt");
