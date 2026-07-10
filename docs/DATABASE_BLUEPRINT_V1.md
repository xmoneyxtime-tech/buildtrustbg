# BuildTrustBG Database Blueprint v1.0

**Version:** 1.0  
**Project:** BuildTrustBG  
**Status:** Draft (Architecture Phase)  
**Author:** BuildTrustBG Engineering Team

---

# 1. Vision

BuildTrustBG is not a company directory.

BuildTrustBG is a trust platform connecting customers with verified construction companies through transparency, verified information, artificial intelligence and reputation.

Every database entity must support this mission.

The database is designed to:

- scale for future growth;
- support AI-powered features;
- support premium subscriptions;
- support multiple business models;
- support future mobile applications;
- remain maintainable for years.

---

# 2. Core Design Principles

## Principle 1

Users and Companies are different entities.

A User is an identity.

A Company is a business.

A user may own a company.

A company never represents authentication.

---

## Principle 2

Authentication belongs only to the User entity.

Companies never log in.

Users log in and receive permissions over companies.

---

## Principle 3

Everything important has its own table.

We avoid storing business data as plain strings whenever relationships are required.

Examples:

- City
- Category
- Subscription
- Verification
- Trust Score

---

## Principle 4

Every important object must be traceable.

The system must always know:

- who created it;
- when it was created;
- who modified it;
- when it was modified.

---

## Principle 5

The database must support future expansion without structural redesign.

Future features must be added through new entities instead of changing existing ones.

---

# 3. Architecture Overview

The platform consists of the following domains:

1. Identity
2. Companies
3. Marketplace
4. Reviews
5. Projects
6. Services
7. Gallery
8. AI
9. Premium
10. Payments
11. Notifications
12. Administration
13. Analytics
14. Audit
---

# 4. Domain Architecture

The platform is divided into independent business domains.

Each domain owns its own data and business logic while remaining connected through well-defined relationships.

This architecture follows Domain-Driven Design (DDD) principles to keep the system maintainable and scalable.

---

## 4.1 Identity Domain

Responsible for:

- Authentication
- Authorization
- User Sessions
- User Roles
- Account Security

Main entity:

- User

The Identity Domain never stores business information about companies.

Authentication always belongs to a User.

---

## 4.2 Company Domain

Responsible for:

- Company Profile
- Company Ownership
- Verification
- Trust
- Public Presentation

Main entities:

- Company
- CompanyApplication
- Verification
- TrustScore

This is the heart of BuildTrustBG.

Every business feature starts from the Company entity.

---

## 4.3 Marketplace Domain

Responsible for:

- Categories
- Cities
- Search
- Filtering
- Discovery

Main entities:

- Category
- City

Marketplace entities must remain independent from Company.

This allows flexible searching and future expansion.

---

## 4.4 Content Domain

Responsible for:

- Projects
- Gallery
- Services

Main entities:

- Project
- GalleryImage
- Service

Companies build trust by publishing content.

---

## 4.5 Reputation Domain

Responsible for:

- Reviews
- Review Replies
- Ratings
- AI Review Analysis

Main entities:

- Review
- ReviewReply
- AIReview

This domain directly affects the Trust Score.

---

## 4.6 Premium Domain

Responsible for:

- Subscription
- Premium Plans
- Gold Verification
- Billing

Main entities:

- Subscription
- Payment

Premium features never change the Company entity directly.

They extend it.

---

## 4.7 Communication Domain

Responsible for:

- Messages
- Notifications

Main entities:

- Conversation
- Message
- Notification

This domain enables direct communication between customers and companies.

---

## 4.8 Administration Domain

Responsible for:

- Moderation
- Approval
- Audit
- Platform Management

Main entities:

- AuditLog

Administrators never bypass business rules.

Every administrative action is recorded.
---

# 5. Core Business Rules

The database exists to enforce business rules.

Every entity, relation and workflow must support these rules.

The application logic must never bypass them.

---

## Rule 1 — Users own Companies

A company cannot exist without an owner.

Ownership belongs to a User.

The owner may later invite additional managers or employees.

Initial version:

- One User → One Company

Future versions may support:

- One User → Multiple Companies
- Multiple Users → One Company

---

## Rule 2 — Authentication

Authentication belongs only to Users.

Companies never authenticate.

Companies inherit permissions from their owners.

---

## Rule 3 — Company Applications

A company profile is never created directly.

Every company starts as a CompanyApplication.

Workflow:

Draft

↓

Submitted

↓

Admin Review

↓

Approved

↓

Company Created

or

Rejected

This guarantees quality control.

---

## Rule 4 — Public Visibility

Only ACTIVE companies are visible inside the Marketplace.

Pending

Rejected

Suspended

Archived

companies are never publicly searchable.

---

## Rule 5 — Reviews

Only registered users may submit reviews.

Every review belongs to:

- one company
- one user

Companies cannot modify reviews.

Companies may only publish official replies.

---

## Rule 6 — AI Trust Score

Trust Score is calculated.

It is never manually edited.

The score is generated from:

- reviews
- verification
- profile completeness
- activity
- premium signals
- AI analysis

---

## Rule 7 — Verification

Verification is independent from Subscription.

A company may be:

Verified + Free

or

Premium + Not Verified

Both systems work independently.

---

## Rule 8 — Premium

Premium affects visibility.

Premium never affects Trust Score.

Trust cannot be purchased.

---

## Rule 9 — Soft Delete

Business entities should never be permanently deleted.

Instead they become:

Archived

Suspended

Inactive

This preserves history.

---

## Rule 10 — Audit

Every important action is logged.

Examples:

Company approved

Company rejected

Subscription changed

Verification approved

Admin login

User banned

No administrative action should exist without an audit record.

---

# 6. Entity Specifications

This chapter defines every database entity.

Each entity includes:

- Business Purpose
- Responsibilities
- Ownership
- Lifecycle
- Relationships
- Security
- Future Expansion

This document represents the source of truth for the Prisma schema.

---

# 6.1 User

## Business Purpose

The User entity represents a human identity.

Users authenticate into the platform.

Users never represent businesses.

A User may:

- browse companies
- submit reviews
- save favourites
- own one or more companies
- manage company data
- communicate with companies
- purchase subscriptions
- receive notifications

---

## Responsibilities

Authentication

Authorization

Identity

Ownership

Communication

---

## Lifecycle

Registered

↓

Verified

↓

Active

↓

Suspended

↓

Archived

---

## Security

Passwords are never stored in plain text.

Passwords are hashed using bcrypt.

Every login creates an authenticated session.

Sensitive actions require authentication.

---

## Relationships

User

owns

Company

writes

Review

receives

Notification

creates

Favorite

participates in

Conversation

---

## Future Expansion

The User entity must support:

- OAuth Providers
- Two Factor Authentication
- Multiple Companies
- Team Management
- Mobile Login
- API Tokens

---

# 6.2 Company

## Business Purpose

The Company entity represents a construction business.

It contains all public business information.

The Company entity never authenticates.

Authentication always belongs to the User.

---

## Responsibilities

Public Profile

Marketplace Listing

Trust

Verification

Premium

Reviews

Projects

Services

Gallery

---

## Lifecycle

Application Submitted

↓

Approved

↓

Active

↓

Premium

↓

Suspended

↓

Archived

---

## Relationships

Company

belongs to

User

has many

Projects

Services

Gallery Images

Reviews

Subscriptions

Payments

Messages

Notifications

Verification Records

Trust Score Records

---

## Public Information

Company Name

Slug

Description

Logo

Cover Image

Email

Phone

Website

Address

Category

City

Opening Hours

Social Links

---

## Internal Information

Owner

Verification Status

Subscription

Premium Status

Trust Score

AI Analysis

Audit History

Created At

Updated At

---

## Future Expansion

Employees

Branches

Teams

CRM Integration

ERP Integration

Invoices

Analytics

API Access


---

# 6.3 CompanyApplication

## Business Purpose

The CompanyApplication entity is the entry point into the BuildTrustBG ecosystem.

No company profile is ever created directly.

Every business must first submit an application.

The application workflow guarantees quality, trust and platform moderation.

---

## Responsibilities

Collect company information

Validate business data

Store uploaded documents

Track approval progress

Store administrator decisions

Provide a complete audit trail

---

## Workflow

Draft

↓

Submitted

↓

Automatic Validation

↓

AI Analysis

↓

Administrator Review

↓

Approved

↓

Company Created

or

Rejected

---

## Application Status

DRAFT

SUBMITTED

UNDER_REVIEW

ADDITIONAL_INFORMATION_REQUIRED

APPROVED

REJECTED

EXPIRED

---

## Stored Information

Business Information

Owner Information

Contact Information

Company Description

Requested Category

Requested City

Uploaded Documents

Verification Documents

AI Analysis

Administrator Notes

Decision History

Approval Timeline

Created Date

Updated Date

---

## AI Validation

Every application is automatically analysed.

The AI module evaluates:

Profile completeness

Description quality

Duplicate detection

Contact consistency

Business legitimacy indicators

Potential fraud indicators

Missing information

The AI never approves an application.

It only assists administrators.

---

## Administrator Review

Administrators may:

Approve

Reject

Request additional information

Suspend review

Assign another reviewer

Leave internal notes

Every action is recorded.

---

## Approval Process

When approved:

A Company entity is automatically created.

Ownership is assigned.

Verification workflow begins.

Notifications are sent.

The original application remains archived.

---

## Rejection Process

Rejected applications remain stored.

Reasons are never deleted.

Applicants may submit a new application later.

Historical applications remain available to administrators.

---

## Future Expansion

Bulk approval

Multiple reviewers

Voting system

AI risk scoring

Automatic document validation

Government registry integration

Business license verification

VAT verification

Digital signature support


---

# 6.4 Review

## Business Purpose

Reviews are the foundation of trust inside BuildTrustBG.

The goal is not to collect stars.

The goal is to measure company quality.

Every review contributes to the Trust Score.

---

## Responsibilities

Collect customer experience

Support AI analysis

Generate Trust Score

Improve marketplace transparency

Help customers choose reliable companies

---

## Review Structure

Every review contains:

Overall Rating

Work Quality

Communication

Professionalism

Price / Value

Deadline Accuracy

Cleanliness

Recommendation

Review Title

Review Content

Created Date

Updated Date

---

## Rating Scale

1

Very Poor

2

Poor

3

Average

4

Good

5

Excellent

---

## Recommendation

Every review contains:

Would you recommend this company?

YES

NO

This metric becomes one of the strongest trust indicators.

---

## Review Lifecycle

Created

↓

Published

↓

Company Reply

↓

AI Analysis

↓

Trust Score Updated

---

## Company Reply

Companies cannot edit reviews.

Companies may publish one official reply.

Replies remain permanently attached to the review.

---

## AI Review Analysis

Every review is analysed.

The AI evaluates:

Sentiment

Spam Probability

Fake Review Probability

Language Quality

Toxicity

Review Summary

Confidence Score

---

## Review Verification

Future versions may support:

Invoice Verification

Photo Verification

Contract Verification

Location Verification

Verified Customer Badge

Verified reviews receive additional weight.

---

## Future Expansion

Photo Reviews

Video Reviews

Before / After Images

Project References

Verified Purchases

AI Generated Summary

Review Translation

Duplicate Detection


---

# 6.5 BuildTrust Score™

## Business Purpose

The BuildTrust Score™ is the core trust metric of the BuildTrustBG platform.

It is not an average rating.

It is a proprietary reputation algorithm designed to estimate the overall reliability of a construction company.

The objective is to help customers make better decisions while rewarding transparency and long-term quality.

---

## Philosophy

Trust cannot be bought.

Trust must be earned.

The BuildTrust Score™ reflects long-term behaviour instead of short-term popularity.

Every score is calculated.

No administrator may manually assign a Trust Score.

---

## Score Range

Minimum Score

0

Maximum Score

100

Score Categories

95–100

Exceptional

90–94

Excellent

80–89

Very Good

70–79

Good

60–69

Average

Below 60

Needs Improvement

---

## Score Components

The BuildTrust Score™ is calculated from multiple independent signals.

### Customer Reviews

Overall Rating

Review Quality

Recommendation Rate

Review Consistency

Verified Reviews

---

### Company Profile

Profile Completeness

Business Description

Company Images

Projects

Services

Business Information

---

### Verification

Identity Verification

Business Verification

Document Verification

Gold Verification

---

### Activity

Recent Activity

Response Time

Review Replies

Profile Updates

Customer Communication

---

### AI Analysis

Review Authenticity

Language Quality

Spam Detection

Duplicate Detection

Fraud Indicators

Behaviour Analysis

---

### Reputation Signals

Complaint Ratio

Recommendation Ratio

Review Stability

Long-term Consistency

Customer Retention Signals

---

## Dynamic Updates

The score is recalculated automatically whenever:

A new review is published.

A review is edited.

Verification changes.

Premium status changes.

Company information changes.

AI analysis changes.

---

## Future AI Features

Predictive Trust Score

Risk Detection

Company Health Index

Quality Trend

Growth Trend

Reputation Forecast

Fraud Probability

---

## Public Display

Customers never see raw calculations.

Customers only see:

BuildTrust Score™

Score Category

Trust Summary

AI Confidence

Verification Status

Number of Reviews

Recommendation Percentage

---

## Internal Data

Administrators may view:

Component Weights

Calculation History

AI Signals

Risk Indicators

Historical Trends

Manual Review Flags

Algorithm Version

---

## Versioning

Every algorithm update is versioned.

Historical scores remain reproducible.

Future AI improvements never invalidate previous calculations.

---

# 6.6 Category

## Business Purpose

Categories organize companies into clear business sectors.

Categories improve search quality, filtering and SEO.

A Company always belongs to one primary category.

Future versions may support multiple categories.

---

## Responsibilities

Business Classification

Marketplace Navigation

Filtering

SEO URLs

Homepage Sections

AI Recommendations

Statistics

---

## Public Information

Category Name

Slug

Icon

Description

Color

Sort Order

SEO Metadata

---

## Relationships

One Category

↓

Many Companies

One Category

↓

Many Services

One Category

↓

Marketplace Statistics

---

## Business Rules

Categories cannot be deleted while companies are assigned.

Inactive categories remain available for historical data.

Slug values must remain unique.

Administrators manage categories from the Admin Dashboard.

---

## Future Expansion

Subcategories

Category Icons

AI Category Detection

Trending Categories

Featured Categories

Seasonal Categories

Category Analytics

---

# 6.7 City

## Business Purpose

Cities define the geographical location of companies.

Cities improve local search, filtering and regional analytics.

A Company belongs to one primary city.

---

## Responsibilities

Regional Search

Marketplace Filtering

SEO URLs

Regional Statistics

Distance Calculations

Future Maps Integration

---

## Public Information

City Name

Slug

Region

Latitude

Longitude

Population (optional)

---

## Relationships

One City

↓

Many Companies

One City

↓

Regional Statistics

---

## Business Rules

Cities cannot be removed while companies exist.

Slug values are unique.

Administrators manage cities from the Admin Dashboard.

---

## Future Expansion

Neighbourhoods

Districts

Map Search

Nearby Companies

Radius Search

GPS Integration

---

# 6.8 Service

## Business Purpose

Services describe what a company offers.

Services improve customer understanding, AI recommendations and search relevance.

Every service belongs to one company.

---

## Responsibilities

Service Presentation

Marketplace Search

AI Matching

Pricing Information

SEO Content

Customer Understanding

---

## Public Information

Service Name

Slug

Description

Starting Price

Price Type

Featured

Estimated Duration

Gallery

---

## Relationships

One Company

↓

Many Services

Services appear in:

Marketplace

Search Results

Company Profile

AI Recommendation Engine

---

## Business Rules

A service cannot exist without a company.

Service names must be unique within the same company.

Inactive services remain stored for history.

---

## Future Expansion

Packages

Discounts

Seasonal Pricing

Availability

Online Booking

AI Generated Descriptions

---

# 6.9 Project

## Business Purpose

Projects demonstrate real completed work.

Projects are one of the strongest trust indicators.

Customers trust real work more than marketing.

---

## Responsibilities

Portfolio

Proof of Experience

SEO Content

AI Quality Analysis

Customer Confidence

---

## Public Information

Project Title

Description

Completion Date

Location

Images

Services Used

Budget (optional)

Duration

Customer Testimonial (optional)

---

## Relationships

One Company

↓

Many Projects

Projects support:

Gallery

Reviews

AI Analysis

Trust Score

---

## Business Rules

Projects cannot exist without a company.

Images remain permanently connected.

Projects may be featured.

---

## Future Expansion

Before / After

360 Images

Video

Drone Footage

Project Timeline

Customer Approval

AI Image Quality Analysis

---

# 6.10 GalleryImage

## Business Purpose

Images create trust.

Customers make decisions visually before reading descriptions.

Every image uploaded by a company contributes to transparency and credibility.

The gallery represents real completed work.

---

## Responsibilities

Visual Presentation

Project Documentation

SEO Images

AI Image Analysis

Customer Confidence

Premium Branding

---

## Public Information

Image

Caption

Alternative Text

Sort Order

Upload Date

Image Category

---

## Relationships

One Company

↓

Many Gallery Images

Gallery Images may belong to:

Projects

Services

Company Profile

Homepage

---

## Business Rules

Images cannot exist without a company.

Every image is optimized automatically.

Every image receives AI moderation.

Duplicate images are detected.

Images remain historically available.

---

## Future Expansion

Before / After

360 Images

Drone Images

Videos

Virtual Tours

AI Quality Analysis

Automatic Image Tagging

Image Search

---

# 6.11 Verification

## Business Purpose

Verification proves that a company is legitimate.

Verification increases customer confidence.

Verification is independent from Premium.

Trust cannot be purchased.

---

## Verification Levels

Identity Verification

Business Verification

Document Verification

Gold Verification

Future Professional Verification

---

## Responsibilities

Business Validation

Identity Validation

Document Review

Risk Reduction

Fraud Prevention

Trust Building

---

## Verification Status

Pending

Approved

Rejected

Expired

Revoked

---

## Relationships

One Company

↓

One Verification

Verification affects:

BuildTrust Score™

Marketplace Visibility

Customer Trust

AI Confidence

---

## Business Rules

Verification is never automatic.

Administrators approve verification.

AI assists but never decides.

Every verification action is audited.

---

## Future Expansion

Government API

VAT Verification

Digital Signature

Company Registry

Professional Licenses

Insurance Validation

ISO Certificates

---

# 6.12 Subscription

## Business Purpose

Subscriptions provide additional business functionality without affecting trust.

Premium plans improve visibility, marketing tools and analytics.

Premium never guarantees better ratings.

Trust must always be earned.

---

## Subscription Plans

FREE

PREMIUM

GOLD

ENTERPRISE

---

## Responsibilities

Billing

Premium Features

Marketplace Visibility

Analytics

Marketing Tools

AI Features

Priority Support

---

## Relationships

One Company

↓

One Active Subscription

A subscription unlocks platform features.

It never modifies the BuildTrust Score™.

---

## Premium Features

Priority Listing

Homepage Promotion

Featured Badge

Additional Gallery Capacity

Unlimited Projects

Unlimited Services

Business Analytics

Lead Statistics

Marketing Insights

AI Business Reports

Priority Support

---

## Business Rules

Only one active subscription is allowed.

Expired subscriptions automatically downgrade.

Subscription history is never deleted.

Invoices remain permanently stored.

---

## Future Expansion

Stripe

Apple Pay

Google Pay

Annual Plans

Coupons

Referral Discounts

Corporate Plans

Agency Plans

---

# 6.13 Payment

## Business Purpose

Payments manage all financial transactions within the platform.

Every payment is linked to a subscription or future marketplace service.

---

## Responsibilities

Invoices

Transactions

Refunds

Payment Status

Billing History

Accounting Integration

---

## Payment Status

Pending

Completed

Failed

Refunded

Cancelled

---

## Relationships

One Company

↓

Many Payments

Payments belong to subscriptions.

---

## Business Rules

Payments are immutable.

Every transaction receives a unique identifier.

Refund history is preserved.

No payment record is ever permanently deleted.

---

## Future Expansion

Stripe

PayPal

Bank Transfer

Apple Pay

Google Pay

Invoice Automation

Accounting Integration

VAT Reporting

---

# 6.14 Conversation

## Business Purpose

The Conversation entity enables secure communication between customers and companies.

All conversations remain private and traceable.

The messaging system strengthens trust by allowing transparent communication before, during and after a project.

---

## Responsibilities

Customer Communication

Company Communication

Project Discussions

Support

Lead Generation

Notification Triggering

---

## Relationships

One Conversation

↓

Many Messages

One Conversation

↓

One Customer

↓

One Company

---

## Business Rules

A conversation always belongs to one customer and one company.

A conversation cannot exist without participants.

Deleted conversations are archived instead of permanently removed.

Messages remain immutable.

---

## Future Expansion

Attachments

Images

Documents

Voice Messages

Video Calls

AI Assistant

Automatic Translation

Spam Detection

Smart Replies


---

# 6.15 Message

## Business Purpose

Messages represent communication between platform users.

Messages support transparency, documentation and future dispute resolution.

---

## Responsibilities

Communication

File Sharing

Notifications

Timeline History

Customer Support

---

## Message Types

Text

Image

Document

System

AI Suggestion

Notification

---

## Relationships

Many Messages

↓

One Conversation

Messages may contain:

Attachments

Images

Documents

Links

---

## Business Rules

Messages are never edited after delivery.

Messages may be deleted only by platform rules.

Every message has timestamps.

Read status is tracked.

Delivery status is tracked.

---

## Future Expansion

Voice Messages

Video Messages

Translation

AI Generated Replies

Automatic Summaries

Message Search


---

# 6.16 Notification

## Business Purpose

Notifications keep users informed about important platform events.

Notifications improve engagement without becoming intrusive.

---

## Responsibilities

Alerts

Reminders

Approval Updates

Review Updates

Payment Updates

Security Notifications

Marketing Notifications

---

## Notification Types

System

Review

Company

Subscription

Verification

Payment

Security

Marketing

---

## Relationships

One User

↓

Many Notifications

---

## Business Rules

Notifications are timestamped.

Notifications support read/unread state.

Critical notifications cannot be removed before acknowledgement.

---

## Future Expansion

Push Notifications

SMS

Email

WhatsApp

Viber

Mobile Push

AI Smart Notifications

Notification Preferences
