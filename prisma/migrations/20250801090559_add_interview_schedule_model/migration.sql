-- CreateTable
CREATE TABLE "InterviewSchedule" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "candidateName" TEXT NOT NULL,
    "interviewDate" TIMESTAMP(3) NOT NULL,
    "interviewTime" TEXT NOT NULL,
    "interviewType" TEXT NOT NULL,
    "interviewMode" TEXT NOT NULL,
    "platform" TEXT,
    "meetingLink" TEXT,
    "interviewer" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
