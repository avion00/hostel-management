import db from '../config/database-uuid.js';
import { generateUUID } from '../utils/uuid.js';

/**
 * @desc    Get CMS content
 * @route   GET /api/admin/cms
 * @access  Private/Admin
 */
export const getCMS = async (req, res) => {
  try {
    const cms = db.prepare('SELECT * FROM cms ORDER BY id DESC LIMIT 1').get();

    if (!cms) {
      return res.status(404).json({
        success: false,
        message: 'CMS content not found'
      });
    }

    // Parse FAQ if it's JSON
    const parsedCMS = {
      ...cms,
      faq: cms.faq ? JSON.parse(cms.faq) : []
    };

    res.status(200).json({
      success: true,
      data: parsedCMS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching CMS content',
      error: error.message
    });
  }
};

/**
 * @desc    Update CMS content
 * @route   PATCH /api/admin/cms
 * @access  Private/Admin
 */
export const updateCMS = async (req, res) => {
  try {
    const updates = req.body;

    // Get existing CMS
    let cms = db.prepare('SELECT * FROM cms ORDER BY id DESC LIMIT 1').get();

    // Convert FAQ array to JSON string if present
    if (updates.faq) {
      updates.faq = JSON.stringify(updates.faq);
    }

    if (!cms) {
      // Create new CMS entry if none exists
      const fields = ['id', ...Object.keys(updates)];
      const placeholders = fields.map(() => '?').join(', ');
      const values = [generateUUID(), ...Object.keys(updates).map(field => updates[field])];

      db.prepare(`
        INSERT INTO cms (${fields.join(', ')})
        VALUES (${placeholders})
      `).run(...values);

      cms = db.prepare('SELECT * FROM cms WHERE id = ?').get(values[0]);
    } else {
      // Update existing CMS
      const fields = Object.keys(updates);
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field]);

      db.prepare(`
        UPDATE cms
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(...values, cms.id);

      cms = db.prepare('SELECT * FROM cms WHERE id = ?').get(cms.id);
    }

    res.status(200).json({
      success: true,
      message: 'CMS content updated successfully',
      data: {
        ...cms,
        faq: cms.faq ? JSON.parse(cms.faq) : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating CMS content',
      error: error.message
    });
  }
};

/**
 * @desc    Get public CMS content (for frontend)
 * @route   GET /api/cms/public
 * @access  Public
 */
export const getPublicCMS = async (req, res) => {
  try {
    const cms = db.prepare(`
      SELECT 
        banner_title,
        banner_subtitle,
        banner_image,
        about_us,
        contact_email,
        contact_phone,
        contact_address,
        faq,
        terms,
        privacy_policy
      FROM cms
      ORDER BY id DESC
      LIMIT 1
    `).get();

    if (!cms) {
      return res.status(404).json({
        success: false,
        message: 'CMS content not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...cms,
        faq: cms.faq ? JSON.parse(cms.faq) : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching CMS content',
      error: error.message
    });
  }
};
