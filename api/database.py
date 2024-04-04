from sqlmodel import SQLModel, create_engine

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, pool_size=20, max_overflow=0)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
