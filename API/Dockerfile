FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Додаємо ping
RUN apt-get update && apt-get install -y iputils-ping

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копіюємо .csproj файли
COPY ../BLL/BLL.csproj ./BLL/
COPY ../DAL/DAL.csproj ./DAL/
COPY ./API/API.csproj ./API/

# Відновлення залежностей
RUN dotnet restore ./API/API.csproj

# Копіюємо код проєкту, крім тестів
COPY ../BLL ./BLL/
COPY ../DAL ./DAL/
COPY ./API ./API/

# Виключаємо папку з тестами
RUN rm -rf /src/API/Tests

WORKDIR /src/API

# Збірка проєкту (без тестів)
RUN dotnet build API.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]
