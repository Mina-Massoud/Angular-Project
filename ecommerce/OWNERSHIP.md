# Team Ownership Map

Single source of truth for who owns what. Every file under `src/` starts with a header comment matching this map. **Do not edit a file you do not own** — if you need a change, ask the owner.

API source of truth: `Route E-commerce App.postman_collection.json` (project root).
Base URL: `https://ecommerce.routemisr.com/api/v1` — set in `src/environments/environment.ts`. Do not hardcode URLs anywhere; always read from `environment.baseUrl`.
Auth header: routemisr API uses a custom `token` header (NOT `Authorization: Bearer`). Wired in `auth.interceptor.ts`.

---

## 1. Mina — Foundation, Auth, Checkout, Chatbot

| Path | Files |
|---|---|
| `src/environments/` | `environment.ts`, `environment.prod.ts` |
| `src/app/core/interceptors/` | `auth.interceptor.ts`, `error.interceptor.ts`, `loading.interceptor.ts` |
| `src/app/core/guards/` | `auth.guard.ts` |
| `src/app/core/services/` | `auth.service.ts`, `loading.service.ts`, `toast.service.ts` |
| `src/app/core/models/` | `api-response.model.ts`, `user.model.ts` |
| `src/app/shared/components/loading-spinner/` | `loading-spinner.{ts,html,css}` |
| `src/app/shared/components/toast/` | `toast.{ts,html,css}` |
| `src/app/features/auth/` | `sign-up/`, `sign-in/`, `forgot-password/`, `reset-password/`, `auth.routes.ts` |
| `src/app/features/checkout/` | `checkout-page/`, `payment-success/`, `payment-failure/`, `checkout.routes.ts` |
| `src/app/features/chatbot/` | `chatbot-widget/`, `services/chatbot.service.ts`, `models/chat-message.model.ts` |
| Root | `src/app/app.config.ts`, `src/app/app.routes.ts`, `src/app/app.{ts,html,css}` |

**Status:** foundation + auth implemented. Checkout + chatbot left as stubs to implement after checkout cart contract is finalized.

---

## 2. Noura — Catalog browse + currency pipe

| Path | Files |
|---|---|
| `src/app/features/categories/` | `categories-list/`, `category-details/`, `services/categories.service.ts`, `models/category.model.ts`, `categories.routes.ts` |
| `src/app/features/subcategories/` | `subcategories-list/`, `subcategory-details/`, `services/subcategories.service.ts`, `models/subcategory.model.ts`, `subcategories.routes.ts` |
| `src/app/features/brands/` | `brands-list/`, `brand-details/`, `services/brands.service.ts`, `models/brand.model.ts`, `brands.routes.ts` |
| `src/app/shared/pipes/` | `currency-format.pipe.ts` |

**API endpoints**: see `services/*.service.ts` headers — copied from Postman collection.

---

## 3. Youssef — Products + shared product-card

| Path | Files |
|---|---|
| `src/app/features/products/` | `products-list/`, `product-details/`, `services/products.service.ts`, `models/product.model.ts`, `products.routes.ts` |
| `src/app/shared/components/product-card/` | `product-card.{ts,html,css}` |

**Note:** `product-card` is reused by Ahmed's wishlist + cart and Noura's category detail. Keep its `@Input() product: Product` shape stable.

---

## 4. Ahmed Gabr — Cart + Wishlist

| Path | Files |
|---|---|
| `src/app/features/cart/` | `cart-page/`, `services/cart.service.ts`, `models/cart.model.ts`, `cart.routes.ts` |
| `src/app/features/wishlist/` | `wishlist-page/`, `services/wishlist.service.ts`, `models/wishlist.model.ts`, `wishlist.routes.ts` |

**Pattern:** both features follow the same `add / remove / list-by-user` shape — implement cart first, copy structure into wishlist.

---

## 5. Mostafa Shanab — Profile, Orders, Navbar, Footer

| Path | Files |
|---|---|
| `src/app/features/profile/` | `profile-page/`, `change-password/`, `addresses/`, `services/profile.service.ts`, `profile.routes.ts` |
| `src/app/features/orders/` | `orders-list/`, `order-details/`, `services/orders.service.ts`, `models/order.model.ts`, `orders.routes.ts` |
| `src/app/shared/components/navbar/` | `navbar.{ts,html,css}` |
| `src/app/shared/components/footer/` | `footer.{ts,html,css}` |

**Cross-dev contract:** `OrdersService.createCashOrder()` and `createCheckoutSession()` are pre-declared. Mina's checkout-page calls them. **Do not rename or change signatures** without coordinating with Mina.

---

## Dependency / merge order

1. **Mina** lands first — others can `git pull` and start.
2. **Mostafa**: `navbar` + `footer` so the app shell renders.
3. **Noura**: `currency-format.pipe` so prices display correctly.
4. **Youssef**: `product-card` so cart/wishlist/category-detail can reuse it.
5. **Everyone** in parallel.

## Conventions

- Standalone components only (`standalone: true`).
- File names: `kebab-case.ts/html/css`. Class: `PascalCase`. Selector: `app-kebab-case`.
- Always inject HttpClient via `inject(HttpClient)`, never constructor.
- Never hardcode URLs — use `environment.baseUrl`.
- Toast feedback: `inject(ToastService)` and call `.success(...)` / `.error(...)`.
- Loading is automatic (loadingInterceptor wraps every HTTP call).
