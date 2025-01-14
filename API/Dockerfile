# Base image для виконання
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Build image для збірки проєкту
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Копіюємо проєкти і відновлюємо залежності
COPY ["API/API.csproj", "API/"]
COPY ["DAL/DAL.csproj", "DAL/"]
COPY ["BLL/BLL.csproj", "BLL/"]
RUN dotnet restore "API/API.csproj"

# Копіюємо весь код і збираємо проєкт
COPY . .
WORKDIR "/src/API"
RUN dotnet build "API.csproj" -c Release -o /app/build

# Publish image для створення виконуваного пакета
FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final image для запуску
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]
