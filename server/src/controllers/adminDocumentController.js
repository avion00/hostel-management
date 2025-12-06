import db from '../config/database.js';

/**
 * @desc    Get all documents with filters
 * @route   GET /api/admin/documents
 * @access  Private/Admin
 */
export const getAllDocuments = async (req, res) => {
  try {
    const { status, type, user, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        d.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        v.name as verified_by_name
      FROM documents d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN users v ON d.verified_by = v.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND d.status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND d.type = ?';
      params.push(type);
    }

    if (user) {
      query += ' AND d.user_id = ?';
      params.push(user);
    }

    // Get total count
    const countQuery = query.replace(
      'SELECT d.*, u.name as user_name, u.email as user_email, u.role as user_role, v.name as verified_by_name FROM documents d',
      'SELECT COUNT(*) as total FROM documents d'
    );
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult?.total || 0;

    // Get paginated results
    query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const documents = db.prepare(query).all(...params);

    res.status(200).json({
      success: true,
      data: {
        documents,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

/**
 * @desc    Get single document by ID
 * @route   GET /api/admin/documents/:id
 * @access  Private/Admin
 */
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = db.prepare(`
      SELECT 
        d.*,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        u.role as user_role,
        v.name as verified_by_name
      FROM documents d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN users v ON d.verified_by = v.id
      WHERE d.id = ?
    `).get(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Get user's other documents
    const otherDocuments = db.prepare(`
      SELECT * FROM documents WHERE user_id = ? AND id != ?
    `).all(document.user_id, id);

    res.status(200).json({
      success: true,
      data: {
        document,
        otherDocuments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching document',
      error: error.message
    });
  }
};

/**
 * @desc    Approve document
 * @route   PATCH /api/admin/documents/:id/approve
 * @access  Private/Admin
 */
export const approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const adminId = req.user.id; // From auth middleware

    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (document.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Document is already approved'
      });
    }

    db.prepare(`
      UPDATE documents
      SET status = 'approved',
          remarks = ?,
          verified_by = ?,
          verified_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(remarks || 'Document verified and approved', adminId, id);

    // TODO: Send notification to user

    res.status(200).json({
      success: true,
      message: 'Document approved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving document',
      error: error.message
    });
  }
};

/**
 * @desc    Reject document
 * @route   PATCH /api/admin/documents/:id/reject
 * @access  Private/Admin
 */
export const rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const adminId = req.user.id; // From auth middleware

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (document.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Document is already rejected'
      });
    }

    db.prepare(`
      UPDATE documents
      SET status = 'rejected',
          remarks = ?,
          verified_by = ?,
          verified_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(remarks, adminId, id);

    // TODO: Send notification to user with rejection reason

    res.status(200).json({
      success: true,
      message: 'Document rejected successfully',
      remarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting document',
      error: error.message
    });
  }
};

/**
 * @desc    Get document verification statistics
 * @route   GET /api/admin/documents/stats
 * @access  Private/Admin
 */
export const getDocumentStats = async (req, res) => {
  try {
    // Status breakdown
    const statusBreakdown = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM documents
      GROUP BY status
    `).all();

    // Type breakdown
    const typeBreakdown = db.prepare(`
      SELECT type, COUNT(*) as count
      FROM documents
      GROUP BY type
    `).all();

    // Pending documents by user role
    const pendingByRole = db.prepare(`
      SELECT u.role, COUNT(d.id) as count
      FROM documents d
      JOIN users u ON d.user_id = u.id
      WHERE d.status = 'pending'
      GROUP BY u.role
    `).all();

    // Recent verifications
    const recentVerifications = db.prepare(`
      SELECT 
        d.*,
        u.name as user_name,
        v.name as verified_by_name
      FROM documents d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN users v ON d.verified_by = v.id
      WHERE d.status IN ('approved', 'rejected')
      ORDER BY d.verified_at DESC
      LIMIT 10
    `).all();

    res.status(200).json({
      success: true,
      data: {
        statusBreakdown,
        typeBreakdown,
        pendingByRole,
        recentVerifications
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching document statistics',
      error: error.message
    });
  }
};
