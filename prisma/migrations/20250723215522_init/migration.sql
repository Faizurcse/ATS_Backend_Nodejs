-- CreateTable
CREATE TABLE "Ats_User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "number" TEXT NOT NULL,

    CONSTRAINT "Ats_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ats_Login" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ats_Login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ats_JobPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "department" TEXT,
    "internalSPOC" TEXT NOT NULL,
    "recruiter" TEXT,
    "jobType" TEXT NOT NULL,
    "experienceLevel" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "fullLocation" TEXT NOT NULL,
    "workType" TEXT,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "priority" TEXT,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "requiredSkills" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ats_JobPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ats_User_email_key" ON "Ats_User"("email");

-- AddForeignKey
ALTER TABLE "Ats_Login" ADD CONSTRAINT "Ats_Login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Ats_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
