import EventLog from '../models/EventLog.js';
import Transaction from '../models/Transaction.js';
import Referral from '../models/Referral.js';

export const trackUserStartedBot = async (userId, campaignId = null, referralSource = null) => {
  try {
    const existingEvent = await EventLog.findOne({
      userId,
      eventType: 'USER_STARTED_BOT'
    });

    if (existingEvent) return;

    await EventLog.create({
      userId,
      eventType: 'USER_STARTED_BOT',
      campaignId,
      referralSource,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking USER_STARTED_BOT:', error);
  }
};

export const trackFirstEssaySubmitted = async (userId, essayId) => {
  try {
    const existingEvent = await EventLog.findOne({
      userId,
      eventType: 'FIRST_ESSAY_SUBMITTED'
    });

    if (existingEvent) return;

    await EventLog.create({
      userId,
      eventType: 'FIRST_ESSAY_SUBMITTED',
      metadata: { essayId },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking FIRST_ESSAY_SUBMITTED:', error);
  }
};

export const trackSecondEssaySubmitted = async (userId, essayId) => {
  try {
    const existingEvent = await EventLog.findOne({
      userId,
      eventType: 'SECOND_ESSAY_SUBMITTED'
    });

    if (existingEvent) return;

    await EventLog.create({
      userId,
      eventType: 'SECOND_ESSAY_SUBMITTED',
      metadata: { essayId },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking SECOND_ESSAY_SUBMITTED:', error);
  }
};

export const trackPaymentPageViewed = async (userId) => {
  try {
    await EventLog.create({
      userId,
      eventType: 'PAYMENT_PAGE_VIEWED',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking PAYMENT_PAGE_VIEWED:', error);
  }
};

export const trackPackagePurchased = async (userId, packageType, amount, campaignId = null) => {
  try {
    await EventLog.create({
      userId,
      eventType: 'PACKAGE_PURCHASED',
      campaignId,
      metadata: { packageType, amount },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking PACKAGE_PURCHASED:', error);
  }
};

export const trackReferralEvent = async (referrerId, referredUserId) => {
  try {
    await EventLog.create({
      userId: referrerId,
      eventType: 'REFERRAL_GENERATED',
      metadata: { referredUserId },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking REFERRAL_GENERATED:', error);
  }
};

export const createTransaction = async (userId, type, amount, creditsReceived, packageType = null) => {
  try {
    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      creditsReceived,
      packageType,
      status: 'PENDING',
      timestamp: new Date()
    });
    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
};

export const approveTransaction = async (transactionId) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status: 'APPROVED' },
      { new: true }
    );
    return transaction;
  } catch (error) {
    console.error('Error approving transaction:', error);
  }
};
