
# Fix Email Delivery for Order Confirmations

## The Problem

The edge function is using Resend's test sender address (`onboarding@resend.dev`) which can only deliver to the Resend account owner. This is why neither customer nor seller emails are being delivered.

---

## Changes Required

### File: `supabase/functions/send-order-confirmation/index.ts`

**1. Update Sender Address (Customer Email)**
Change line 166 from:
```typescript
from: "Vertex Research Labs <onboarding@resend.dev>",
```
to:
```typescript
from: "Vertex Research Labs <info@vertexresearchlabs.com>",
```

**2. Update Sender Address (Internal Notification)**
Change line 222 from:
```typescript
from: "Vertex Research Labs <onboarding@resend.dev>",
```
to:
```typescript
from: "Vertex Research Labs <info@vertexresearchlabs.com>",
```

**3. Update Internal Notification Recipient**
Change line 223 from:
```typescript
to: ["orders@vertexresearchlabs.com"],
```
to:
```typescript
to: ["info@vertexresearchlabs.com"],
```

**4. Update Contact Info in Customer Email**
Change line 146 from mentioning `orders@vertexresearchlabs.com` to `info@vertexresearchlabs.com`

**5. Fix Address Format**
The checkout form now sends structured address fields, but the edge function still expects a single `address` field. I'll update:
- The `OrderRequest` interface to accept the new fields
- The email templates to format the address properly from those fields

---

## Updated Interface

```typescript
interface OrderRequest {
  customer: {
    fullName: string;
    email: string;
    organization: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    notes: string;
  };
  // ... rest stays the same
}
```

---

## Summary

| Change | Before | After |
|--------|--------|-------|
| Sender email | onboarding@resend.dev | info@vertexresearchlabs.com |
| Internal notification recipient | orders@vertexresearchlabs.com | info@vertexresearchlabs.com |
| Contact email in templates | orders@vertexresearchlabs.com | info@vertexresearchlabs.com |
| Address fields | Single `address` field | Structured fields (addressLine1, city, state, etc.) |

After this change, both customer confirmation emails and your internal order notifications will be delivered.
