from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "AI Chat API"
    app_env: str = "development"
    app_port: int = 8000

    # Security
    jwt_secret: str = "change_me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080

    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "ai_chat"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Gemini
    gemini_api_key: str = ""
    gemini_chat_model: str = "gemini-2.0-flash"
    gemini_embedding_model: str = "text-embedding-004"

    # CORS
    frontend_url: str = "http://localhost:3000"
    frontend_urls: str = "http://localhost:3000," "http://localhost:3001," "http://localhost:3002"

    @property
    def allowed_origins(self) -> list[str]:
        urls = [u.strip() for u in self.frontend_urls.split(",") if u.strip()]
        if self.frontend_url and self.frontend_url not in urls:
            urls.append(self.frontend_url)
        return urls


settings = Settings()
