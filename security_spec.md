# Firebase Security Specification - Child Care High School

## 1. Data Invariants
- Chat sessions must have a valid `createdAt` and `updatedAt`.
- Chat sessions can only be created by any user (anonymous or signed in), but once created, only the creator should theoretically manage it. However, the current code doesn't assign a `userId`.
- Chatbot settings (`config` document) can ONLY be read by anyone but ONLY written by an Admin.
- Timestamps MUST be server-side (`request.time`).

## 2. The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to update `chat_sessions` created by another user (if we had userId).
2. **Resource Poisoning**: Inject 1MB string into `chatbot_settings/config.prompt`.
3. **State Shortcutting**: Manually set `updatedAt` to a future date instead of `request.time`.
4. **Shadow Field**: Adding `isAdmin: true` to a user profile (if we had one).
5. **Unauthorized Config Write**: A regular user trying to update `chatbot_settings/config`.
6. **Malicious ID**: Using `../illegal/path` as a document ID.
7. **Type Mismatch**: Sending a boolean for `prompt` in `chatbot_settings`.
8. **Orphaned Write**: Creating a session with an invalid schema.
9. **Bulk Scraping**: Attempting a list query on a restricted collection without filters.
10. **Timestamp Bypass**: Providing a client-side string for `createdAt`.
11. **Negative Size**: Sending an array with negative size (if possible).
12. **Immutable Field Change**: Trying to change `createdAt` on an existing session.

## 3. Test Runner
(I'll generate `firestore.rules.test.ts` later or use it as a reference).
