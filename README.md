# Order System (ASP.NET Core + React)

Це приклад веб-застосунку для управління замовленнями, товарами та користувачами (аутентифікація).

## Технології

- Backend: ASP.NET Core, EF Core, PostgreSQL
- Frontend: React (Context API, React Router, Framer Motion)
- Аутентифікація: JWT
- Ролі: User / Admin
- Контроль версій: Git (GitHub)
- Тести: xUnit

## Структура проєкту

- DAL (Data Access Layer): `AppDbContext`, сутності (`User`, `Order`, `Product`, `OrderItem`), репозиторії (`Repository`, `OrderRepository`)
- BLL (Business Logic Layer): сервіси (`AuthService`, `OrderService`, `ProductService`), DTO, мапінг (AutoMapper)
- Web (ASP.NET Core Controllers): `AuthController`, `OrdersController`, `ProductsController`
- xUnit Tests: `AuthControllerTests`, `OrdersControllerTests`, `OrderServiceTests`, `AuthServiceTests`
- React (frontend): 
  - Компоненти для товарів (ProductList, ProductDetail, ...), 
  - Кошика (Cart), 
  - Замовлень (Orders, AdminOrders),
  - Вхід/Реєстрація (LoginForm, RegisterForm), 
  - Анімації (Framer Motion), 
  - Сповіщення (react-toastify).
1. Клонування репозиторію:
   ```bash
   git clone (https://github.com/denuntren/OrderSystem)
   cd OrderSystem
   ```
   
2. Запуск бекенду
```bash
   cd OrderSystem
   dotnet restore
   dotnet run
```

3. Запуск фронтенду:
```bash
   cd client
   npm install
   npm start
```
   
4. Запуск тестів:
```bash
   cd Tests
   dotnet Tests
```
