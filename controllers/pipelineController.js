import prisma from '../prismaClient.js';

// Update candidate status for a specific job
export const updateCandidateJobStatus = async (req, res) => {
  try {
    const { candidateId, jobId, status } = req.body;

    // Validate required fields
    if (!candidateId || !jobId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID, Job ID, and Status are required fields'
      });
    }

    // Validate status is one of the allowed pipeline status labels
    const allowedStatusLabels = [
      "New Application", "Initial Screening", "Phone Screening", "Skills Assessment", 
      "First Interview", "Second Interview", "Final Interview", "Reference Check", 
      "Offer Preparation", "Offer Sent", "Offer Negotiation", "Offer Accepted", 
      "Background Check", "Hired", "Rejected", "Withdrawn", "On Hold"
    ];

    if (!allowedStatusLabels.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Please use a valid pipeline status label.',
        allowedStatusLabels: allowedStatusLabels
      });
    }

    // Check if the candidate application exists
    const existingApplication = await prisma.candidateApplication.findFirst({
      where: {
        id: parseInt(candidateId),
        jobId: parseInt(jobId)
      }
    });

    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: 'Candidate application not found for the specified job'
      });
    }

    // Update the candidate's status
    const updatedApplication = await prisma.candidateApplication.update({
      where: {
        id: parseInt(candidateId)
      },
      data: {
        status: status,
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: `Candidate status updated to ${status} successfully`,
      data: {
        candidateId: parseInt(candidateId),
        jobId: parseInt(jobId),
        newStatus: status,
        updatedAt: updatedApplication.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate status',
      error: error.message
    });
  }
}; 