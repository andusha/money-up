from fastapi_login import LoginManager

from .config import DEFAULT_SETTINGS


manager = LoginManager(DEFAULT_SETTINGS.secret, DEFAULT_SETTINGS.token_url)
