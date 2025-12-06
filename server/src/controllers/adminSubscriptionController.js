import db from '../config/database-uuid.js';
import { generateUUID } from '../utils/uuid.js';

/**
 * @desc    Create subscription plan
 * @route   POST /api/admin/subscriptions
 * @access  Private/Admin
 */
export const createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      duration_days,
      max_hostels,
      max_rooms,
      features,
      status = 'active'
    } = req.body;

    // Convert features array to JSON string
    const featuresStr = features ? JSON.stringify(features) : null;

    const planId = generateUUID();

    const result = db.prepare(`
      INSERT INTO subscription_plans (
        id, name, description, price, duration_days, max_hostels, max_rooms, features, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(planId, name, description, price, duration_days, max_hostels, max_rooms, featuresStr, status);

    const plan = db.prepare('SELECT * FROM subscription_plans WHERE id = ?').get(planId);

    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully',
      data: {
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subscription plan',
      error: error.message
    });
  }
};

/**
 * @desc    Get all subscription plans
 * @route   GET /api/admin/subscriptions
 * @access  Private/Admin
 */
export const getAllPlans = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM subscription_plans WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult?.total || 0;

    // Get paginated results
    query += ' ORDER BY price ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const plans = db.prepare(query).all(...params);

    // Get subscriber count for each plan
    const plansWithStats = plans.map(plan => {
      const subscriberCount = db.prepare(`
        SELECT COUNT(*) as count FROM user_subscriptions
        WHERE plan_id = ? AND status = 'active'
      `).get(plan.id)?.count || 0;

      return {
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [],
        subscriberCount
      };
    });

    res.status(200).json({
      success: true,
      data: {
        plans: plansWithStats,
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
      message: 'Error fetching subscription plans',
      error: error.message
    });
  }
};

/**
 * @desc    Get single subscription plan by ID
 * @route   GET /api/admin/subscriptions/:id
 * @access  Private/Admin
 */
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = db.prepare('SELECT * FROM subscription_plans WHERE id = ?').get(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Get active subscribers
    const subscribers = db.prepare(`
      SELECT 
        us.*,
        u.name as user_name,
        u.email as user_email
      FROM user_subscriptions us
      JOIN users u ON us.user_id = u.id
      WHERE us.plan_id = ?
      ORDER BY us.created_at DESC
    `).all(id);

    res.status(200).json({
      success: true,
      data: {
        plan: {
          ...plan,
          features: plan.features ? JSON.parse(plan.features) : []
        },
        subscribers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plan',
      error: error.message
    });
  }
};

/**
 * @desc    Update subscription plan
 * @route   PATCH /api/admin/subscriptions/:id
 * @access  Private/Admin
 */
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const plan = db.prepare('SELECT * FROM subscription_plans WHERE id = ?').get(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Convert features array to JSON string if present
    if (updates.features) {
      updates.features = JSON.stringify(updates.features);
    }

    // Build dynamic update query
    const fields = Object.keys(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);

    db.prepare(`
      UPDATE subscription_plans
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(...values, id);

    const updatedPlan = db.prepare('SELECT * FROM subscription_plans WHERE id = ?').get(id);

    res.status(200).json({
      success: true,
      message: 'Subscription plan updated successfully',
      data: {
        ...updatedPlan,
        features: updatedPlan.features ? JSON.parse(updatedPlan.features) : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subscription plan',
      error: error.message
    });
  }
};

/**
 * @desc    Delete subscription plan
 * @route   DELETE /api/admin/subscriptions/:id
 * @access  Private/Admin
 */
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = db.prepare('SELECT * FROM subscription_plans WHERE id = ?').get(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Check for active subscriptions
    const activeSubscriptions = db.prepare(`
      SELECT COUNT(*) as count FROM user_subscriptions
      WHERE plan_id = ? AND status = 'active'
    `).get(id)?.count;

    if (activeSubscriptions > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete plan with ${activeSubscriptions} active subscription(s). Deactivate it instead.`
      });
    }

    db.prepare('DELETE FROM subscription_plans WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'Subscription plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subscription plan',
      error: error.message
    });
  }
};

/**
 * @desc    Assign subscription plan to user
 * @route   POST /api/admin/subscriptions/assign
 * @access  Private/Admin
 */
export const assignPlanToUser = async (req, res) => {
  try {
    const { user_id, plan_id, start_date } = req.body;

    // Validate user exists and is a manager
    const user = db.prepare('SELECT id, role FROM users WHERE id = ? AND role = ?').get(user_id, 'manager');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Manager not found'
      });
    }

    // Validate plan exists
    const plan = db.prepare('SELECT * FROM subscription_plans WHERE id = ? AND status = ?').get(plan_id, 'active');
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found or inactive'
      });
    }

    // Calculate end date
    const startDateObj = start_date ? new Date(start_date) : new Date();
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(endDateObj.getDate() + plan.duration_days);

    const startDateStr = startDateObj.toISOString().split('T')[0];
    const endDateStr = endDateObj.toISOString().split('T')[0];

    // Check for existing active subscription
    const existingSubscription = db.prepare(`
      SELECT * FROM user_subscriptions
      WHERE user_id = ? AND status = 'active'
    `).get(user_id);

    if (existingSubscription) {
      // Expire old subscription
      db.prepare(`
        UPDATE user_subscriptions
        SET status = 'expired', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(existingSubscription.id);
    }

    // Create new subscription
    const subscriptionId = generateUUID();

    const result = db.prepare(`
      INSERT INTO user_subscriptions (id, user_id, plan_id, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `).run(subscriptionId, user_id, plan_id, startDateStr, endDateStr);

    const subscription = db.prepare('SELECT * FROM user_subscriptions WHERE id = ?').get(subscriptionId);

    res.status(201).json({
      success: true,
      message: 'Subscription assigned successfully',
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning subscription',
      error: error.message
    });
  }
};
