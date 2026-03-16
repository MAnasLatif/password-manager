# MAnasPM (Password Manager) Web Application - Software Requirements Specification (SRS)

# 1. Purpose

This document defines the technical Software Requirements Specification for the **web application** of SecureVault.

The web app will allow users to:

- sign up and log in
- unlock their vault with PIN / passkey / biometric-capable browser flow
- create and manage saved accounts
- organize accounts into personal or collection spaces
- share accounts with users and teams
- view shared accounts
- move accounts between personal and collection ownership
- manage audit logs and password history
- use a clean, simple UI inspired by Material-style design

This SRS is only for the **web app**, not the browser extension or mobile app.

---

# 2. Product Scope

The web application is the main user-facing system where users manage their vault data.

It includes:

- authentication screens
- vault unlock flow
- dashboard
- account management
- collections and teams
- sharing UI
- shared-with-me section
- audit logs
- settings and security preferences

It does **not** include:

- browser autofill logic
- extension-based DOM form detection
- native mobile autofill
- mobile-specific biometric SDK implementation

---

# 3. Technology Stack

## 3.1 Frontend

- **Next.js**
- **React**
- **TypeScript**
- **HeroUI v3**
- **Tailwind CSS**

## 3.2 Backend for Web App

- **Next.js Route Handlers / Server Actions**
- **Better Auth**
- **PostgreSQL**
- **Prisma ORM**

## 3.3 Security and Browser Features

- **WebAuthn / Passkeys**
- Secure cookies
- CSRF-safe auth flow
- client-side encryption helpers for password field handling

## 3.4 Deployment

- Docker
- Docker Compose
- environment-based configuration

---

# 4. Web Application Goals

The web app must:

- be simple and fast
- feel familiar and clean
- work on desktop and mobile browsers
- support secure authentication and vault unlock
- allow structured account storage
- allow team and personal sharing models
- keep password fields encrypted at rest
- provide a scalable base for future extension and mobile integration

---

# 5. Functional Modules

The web app is divided into these main modules:

1. Authentication
2. Vault Unlock
3. Dashboard
4. Account Management
5. Custom Fields
6. Collection Management
7. Team Management
8. Sharing Management
9. Shared Vault View
10. Account Move / Reassignment
11. Password History
12. Activity Logs
13. Settings
14. Search and Filtering

---

# 6. User Roles

## 6.1 Standard User

Can:

- manage own vault
- create personal accounts
- create collections
- share accounts
- receive shared accounts
- create teams if allowed by product rules

## 6.2 Team Member

Can:

- access accounts shared with their team
- view permissions based on access rules

## 6.3 Team Owner / Collection Owner

Can:

- manage team members
- assign shared accounts to team
- revoke access

---

# 7. Core User Flows

## 7.1 Sign Up

1. User opens web app
2. User enters email and password
3. User verifies email
4. User sets vault PIN
5. User optionally registers passkey / WebAuthn
6. User enters application dashboard

## 7.2 Login

1. User enters email and password
2. Auth session is created
3. User must unlock vault using:
   - PIN, or
   - passkey, or
   - browser-supported biometric flow

## 7.3 Add Account

1. User clicks “Add Account”
2. User selects platform preset or custom
3. User enters metadata
4. User enters password
5. Password is encrypted before storage
6. Account is saved

## 7.4 View Password

1. User opens account detail
2. User clicks “Show Password”
3. System verifies vault unlocked state
4. Password is decrypted temporarily
5. Password is displayed for a short time or until hidden

## 7.5 Share Account

1. User opens saved account
2. Clicks “Share”
3. Selects:
   - one or more users by email
   - one or more teams

4. System validates recipients exist
5. Access entry is created
6. Recipients see account in shared section

## 7.6 Move Account

1. User selects account
2. Clicks “Move”
3. Selects destination:
   - personal
   - another collection
   - team-owned collection if supported

4. System updates ownership mapping

---

# 8. Detailed Functional Requirements

## 8.1 Authentication Module

### Features

- sign up
- log in
- log out
- email verification
- forgot password
- reset password
- session handling

### Requirements

- user must verify email before full vault usage
- auth sessions must use secure HTTP-only cookies
- password reset links must expire
- login attempts should be rate-limited

---

## 8.2 Vault Unlock Module

### Purpose

Separate account login from vault decryption authorization.

### Supported unlock methods

- PIN
- Passkey
- browser-supported biometric-backed WebAuthn flow

### Requirements

- user cannot reveal encrypted password without vault unlock
- vault unlock state must expire after configurable inactivity
- unlock action should be re-requested for sensitive actions if needed

### Sensitive actions

- reveal password
- copy password
- export account data in future
- change PIN / security settings

---

## 8.3 Dashboard Module

### Features

- overview cards
- recent accounts
- recent shared items
- quick actions
- search bar
- filters

### Dashboard sections

- Personal Accounts
- Collections
- Teams
- Shared With Me
- Recent Activity

### Requirements

- dashboard loads only metadata, not decrypted passwords
- counts should be fast and query-efficient
- recently accessed accounts may be shown without exposing secrets

---

## 8.4 Account Management Module

### Account entity fields

- id
- owner_user_id
- title / service name
- platform preset id (optional)
- url
- username_or_email
- encrypted_password
- notes
- icon key or preset branding reference
- visibility scope
- collection_id nullable
- created_at
- updated_at

### Supported actions

- create account
- edit account
- archive account
- delete account
- reveal password
- copy password
- duplicate account
- assign tags
- attach custom fields

### Rules

- password field must be encrypted
- non-sensitive metadata can remain queryable
- URL should help future platform identification
- platform preset should auto-fill branding when available

---

## 8.5 Platform Presets

### Examples

- Google
- Facebook
- GitHub
- Instagram
- LinkedIn
- X
- Custom

### Requirements

- preset selection should auto-fill:
  - name
  - icon
  - suggested URL

- user can override all preset defaults
- custom option must allow free-form entry

---

## 8.6 Custom Fields Module

### Purpose

Allow structured additional details per account.

### Supported field types

- text
- textarea
- number
- date
- email
- url
- secret text
- image reference or binary-backed entry if implemented in DB
- key-value note entry

### Requirements

- user can add unlimited custom fields within configured size limits
- field labels must be customizable
- some field types may be marked sensitive in future
- password remains the primary encrypted secret in initial version

---

## 8.7 Collection Management Module

### Features

- create collection
- rename collection
- delete collection
- add description
- assign accounts to collection
- keep collection private if no members added

### Rules

- a collection may be personal-only
- a collection may later become shared
- accounts can be moved in or out of collection
- deleting a collection must not delete accounts automatically unless confirmed

---

## 8.8 Team Management Module

### Features

- create team
- rename team
- invite members
- remove members
- assign shared accounts to team

### Data points

- team name
- owner
- members
- created_at
- status

### Rules

- only owner/admin can manage membership
- teams are logical collaboration containers
- one account may be shared with multiple teams if supported

---

## 8.9 Sharing Module

### Sharing targets

- single user by email
- multiple users
- single team
- multiple teams

### Requirements

- recipient must exist in system for direct access-based sharing
- if recipient email does not exist, system may show pending/not-found state
- one account can be shared with many recipients
- sharing should create recipient-visible references, not duplicate raw records unnecessarily

### Share permissions for initial version

- view metadata
- reveal password
- copy password

### Optional future permissions

- edit
- reshare
- revoke others
- owner transfer

---

## 8.10 Shared With Me Module

### UI structure

User sees shared content organized by source, for example:

- Shared by Anas
- Shared by Ahmed
- Shared through ABC Team
- Shared through DevOps Team

### Requirements

- system must separate:
  - direct personal shares
  - team-based shares

- each source section should show related accounts
- revoked items must disappear immediately after permission update

---

## 8.11 Move / Reassign Module

### Supported moves

- personal → collection
- collection → personal
- one collection → another collection

### Requirements

- move operation must preserve password and metadata
- sharing relationships may be preserved or recalculated according to destination rules
- user must receive confirmation before move if access scope changes

---

## 8.12 Password History Module

### Features

- store previous encrypted password versions
- show timeline of password changes
- optionally restore previous value with confirmation

### Requirements

- password history records must also remain encrypted
- history entries must include:
  - changed_by
  - changed_at
  - version number

- user should not see plaintext history unless vault is unlocked

---

## 8.13 Activity Logs Module

### Purpose

Audit important events.

### Logged actions

- account created
- account updated
- password viewed
- password copied
- account shared
- share revoked
- account moved
- collection created
- team created
- member added
- member removed
- password changed

### Requirements

- each event must include:
  - actor
  - action type
  - target entity id
  - timestamp

- logs should be filterable by type and date
- logs are for audit visibility and debugging

---

## 8.14 Search and Filter Module

### Features

- global search
- filter by platform
- filter by collection
- filter by owner/source
- filter by shared vs personal
- sort by updated time / created time / name

### Requirements

- search must work on non-encrypted metadata only
- password contents must never be searchable in plaintext
- filters should be available on desktop and mobile web layouts

---

## 8.15 Settings Module

### Sections

- profile
- security
- PIN management
- passkey management
- session management
- theme
- vault timeout
- account deletion

### Security settings

- change PIN
- register/remove passkeys
- reauthentication for sensitive actions
- session expiry preference

---

# 9. Non-Functional Requirements

## 9.1 Performance

- dashboard should load in under 2 seconds for normal users
- account detail page should load in under 1 second excluding network variability
- password reveal should feel near-instant after unlock authorization

## 9.2 Security

- all password data encrypted at rest
- secure session cookies
- CSRF-safe auth flow
- rate limiting on auth and reveal endpoints
- no plaintext password logging
- no password exposure in analytics or client logs

## 9.3 Usability

- responsive layout
- minimal visual complexity
- simple, familiar patterns
- clear personal vs shared distinctions

## 9.4 Maintainability

- modular code structure
- reusable components
- typed API contracts
- database migrations via Prisma

## 9.5 Scalability

- PostgreSQL-backed
- normalized sharing tables
- efficient indexing on metadata/search columns

---

# 10. Security Design Requirements

## 10.1 Encryption Scope

Encrypted:

- password
- password history values

Not encrypted in initial version:

- service name
- URL
- username/email
- tags
- notes unless later marked sensitive
- custom non-secret fields
- image/file metadata if present

## 10.2 Decryption Rules

- decryption only after vault unlock
- decrypted value must not be persisted unnecessarily in client state
- decrypted value should be short-lived in UI

## 10.3 Browser-Side Considerations

- biometric behavior in browser should rely on WebAuthn/passkey-capable flows
- direct hardware fingerprint APIs are not assumed outside browser-supported standards
- vault unlock state must be stored securely and expire

---

# 11. API Requirements for Web App

The web app requires these API domains:

## 11.1 Auth APIs

- sign up
- sign in
- sign out
- verify email
- reset password
- session check

## 11.2 Vault APIs

- unlock vault
- validate unlock session
- refresh unlock state

## 11.3 Account APIs

- create account
- list accounts
- get account detail
- update account
- delete account
- reveal password
- copy password event log
- move account

## 11.4 Collection APIs

- create collection
- update collection
- delete collection
- list collections

## 11.5 Team APIs

- create team
- update team
- add member
- remove member
- list teams

## 11.6 Sharing APIs

- share account
- revoke share
- list shared with me
- list shared by me

## 11.7 Logs APIs

- list activity logs
- list password history

---

# 12. UI Screens

## 12.1 Public Screens

- landing page
- sign up
- log in
- forgot password
- reset password
- email verification

## 12.2 Authenticated Screens

- dashboard
- personal vault
- collection detail
- teams list
- team detail
- shared with me
- account detail
- add/edit account
- activity logs
- settings

## 12.3 Modal / Drawer Interfaces

- unlock vault
- add collection
- create team
- share account
- move account
- confirm delete
- reveal password

---

# 13. Responsive Design Requirements

The web app must support:

## Desktop

- sidebar navigation
- multi-column dashboard
- table/list hybrid views

## Tablet

- compact sidebar or drawer
- simplified card/grid layouts

## Mobile Web

- bottom-sheet or drawer actions
- card-based account listing
- touch-friendly reveal/copy/share actions

---

# 14. Database Entities Needed for Web App

Main entities:

- users
- sessions
- vault_settings
- passkeys
- accounts
- account_custom_fields
- collections
- collection_members
- teams
- team_members
- account_shares
- account_team_shares
- password_history
- activity_logs

---

# 15. Suggested Folder Structure for Web App

```txt
apps/web
├─ app
│  ├─ (public)
│  ├─ (auth)
│  ├─ dashboard
│  ├─ vault
│  ├─ collections
│  ├─ teams
│  ├─ shared
│  ├─ settings
│  └─ api
├─ components
│  ├─ ui
│  ├─ layout
│  ├─ vault
│  ├─ collections
│  ├─ teams
│  └─ shared
├─ lib
│  ├─ auth
│  ├─ encryption
│  ├─ db
│  ├─ permissions
│  ├─ validators
│  └─ utils
├─ hooks
├─ stores
├─ types
└─ styles
```

---

# 16. Functionalities List for Web App

Here is the full web app functionality list, one by one:

1. User sign up
2. Email verification
3. User login
4. Forgot password
5. Reset password
6. Logout
7. Session management
8. Vault unlock with PIN
9. Vault unlock with passkey
10. Vault unlock with browser biometric-capable flow
11. Dashboard overview
12. Personal vault listing
13. Add account
14. Edit account
15. Delete account
16. Archive account
17. Reveal password
18. Copy password
19. Save service URL
20. Save username/email
21. Save notes
22. Use platform presets
23. Add custom fields
24. Add custom field label/value
25. Organize accounts into collections
26. Create personal collection
27. Rename collection
28. Delete collection
29. Move account to collection
30. Move account back to personal
31. Create team
32. Add team members
33. Remove team members
34. Share account with one user
35. Share account with multiple users
36. Share account with one team
37. Share account with multiple teams
38. View “Shared With Me”
39. View shared sources by owner
40. Revoke sharing
41. Password history tracking
42. Activity log tracking
43. Search accounts
44. Filter accounts
45. Sort accounts
46. Manage security settings
47. Manage PIN
48. Manage passkeys
49. Configure vault timeout
50. Responsive mobile web support

---

# 17. Out of Scope for This Web-Only SRS

These are intentionally excluded from this document:

- browser autofill execution
- extension popup behavior
- content script injection
- native mobile app flows
- offline-first sync
- breach monitoring
- password generator advanced module
- emergency access
- secure notes as separate product domain

---

# 18. Summary

The SecureVault web application is the main control center of the product.

It will provide:

- secure login and vault unlock
- encrypted password storage
- structured account management
- personal and collection organization
- user and team sharing
- shared vault visibility
- password history
- audit logs
- responsive UI using Next.js and HeroUI v3
