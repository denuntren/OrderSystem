# Базовий образ для ASP.NET Core
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Образ для побудови
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копіюємо .csproj файли
COPY ./API/API.csproj ./API/

# Відновлення залежностей
RUN dotnet restore ./API/API.csproj

# Копіюємо код проєкту
COPY . .

WORKDIR /src/API

# Збірка проєкту
RUN dotnet build API.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish API.csproj -c Release -o /app/publish /p:UseAppHost=false

# Контейнер для роботи з API
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "API.dll"]
