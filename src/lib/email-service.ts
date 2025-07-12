import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface ChecklistTaskAssignmentData {
  taskTitle: string;
  taskDescription: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  assignerName?: string;
  taskUrl?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      // Email configuration from environment variables
      const emailConfig: EmailConfig = {
        host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT ?? '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER ?? '',
          pass: process.env.EMAIL_PASS ?? '', // For Gmail, use app password
        },
      };

      // Only create transporter if email credentials are provided
      if (emailConfig.auth.user && emailConfig.auth.pass) {
        this.transporter = nodemailer.createTransport(emailConfig);
        this.isConfigured = true;

        // Verify connection configuration
        this.transporter.verify((error) => {
          if (error) {
            console.error('Email service configuration error:', error);
            this.isConfigured = false;
          } else {
            logger.info('Email service is ready to send messages');
          }
        });
      } else {
        console.warn(
          'Email service not configured: Missing EMAIL_USER or EMAIL_PASS environment variables',
        );
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.warn('Email service not configured, skipping email send');
      return false;
    }

    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME ?? 'Wedding Planner'}" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendTaskAssignmentEmail(
    assigneeEmail: string,
    taskData: ChecklistTaskAssignmentData,
  ): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn(
        'Email service not configured, skipping task assignment email',
      );
      return false;
    }

    const priorityColors = {
      low: '#10B981', // green
      medium: '#F59E0B', // yellow
      high: '#EF4444', // red
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    };

    const subject = `New Wedding Task Assigned: ${taskData.taskTitle}`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 New Wedding Task Assigned</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">You've been assigned a new task for the upcoming wedding!</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #0d9488; margin-top: 0; font-size: 24px; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
              ${taskData.taskTitle}
            </h2>
            
            <div style="margin: 20px 0;">
              <div style="display: inline-block; background: ${priorityColors[taskData.priority]}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                ${taskData.priority} Priority
              </div>
              <div style="display: inline-block; background: #e2e8f0; color: #475569; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-left: 10px;">
                ${taskData.category}
              </div>
            </div>

            ${
              taskData.taskDescription
                ? `
              <div style="margin: 20px 0;">
                <h3 style="color: #475569; font-size: 16px; margin-bottom: 10px;">📝 Description:</h3>
                <p style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 0; border-left: 4px solid #0d9488;">
                  ${taskData.taskDescription}
                </p>
              </div>
            `
                : ''
            }

            ${
              taskData.dueDate
                ? `
              <div style="margin: 20px 0;">
                <h3 style="color: #475569; font-size: 16px; margin-bottom: 10px;">📅 Due Date:</h3>
                <p style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 0; border-left: 4px solid #f59e0b; font-weight: bold;">
                  ${formatDate(taskData.dueDate)}
                </p>
              </div>
            `
                : ''
            }

            ${
              taskData.assignerName
                ? `
              <div style="margin: 20px 0;">
                <h3 style="color: #475569; font-size: 16px; margin-bottom: 10px;">👤 Assigned by:</h3>
                <p style="margin: 0; font-weight: bold; color: #0d9488;">
                  ${taskData.assignerName}
                </p>
              </div>
            `
                : ''
            }

            ${
              taskData.taskUrl
                ? `
              <div style="margin: 30px 0; text-align: center;">
                <a href="${taskData.taskUrl}" style="background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  View Task in Wedding Planner
                </a>
              </div>
            `
                : ''
            }
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>This email was sent by your Wedding Planner application.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    `;

    const text = `
New Wedding Task Assigned: ${taskData.taskTitle}

Description: ${taskData.taskDescription || 'No description provided'}
Priority: ${taskData.priority}
Category: ${taskData.category}
${taskData.dueDate ? `Due Date: ${formatDate(taskData.dueDate)}` : ''}
${taskData.assignerName ? `Assigned by: ${taskData.assignerName}` : ''}

${taskData.taskUrl ? `View task: ${taskData.taskUrl}` : ''}

This email was sent by your Wedding Planner application.
    `;

    return this.sendEmail({
      to: assigneeEmail,
      subject,
      html,
      text,
    });
  }

  async sendTaskCompletionEmail(
    assignerEmail: string,
    taskData: { taskTitle: string; completedBy: string; completionDate: Date },
  ): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    const subject = `Task Completed: ${taskData.taskTitle}`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✅ Task Completed!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Great news! A wedding task has been completed.</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #10b981; margin-top: 0; font-size: 24px;">
              ${taskData.taskTitle}
            </h2>
            
            <p style="margin: 20px 0; font-size: 16px;">
              <strong>Completed by:</strong> ${taskData.completedBy}<br>
              <strong>Completion Date:</strong> ${new Intl.DateTimeFormat(
                'en-US',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                },
              ).format(taskData.completionDate)}
            </p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: assignerEmail,
      subject,
      html,
    });
  }

  isEmailServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

// Export a singleton instance
export const emailService = new EmailService();
export default EmailService;
