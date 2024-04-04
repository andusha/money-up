from api.hero.models import HeroRead
from api.team.models import TeamRead


class HeroReadWithTeam(HeroRead):
    team: TeamRead | None = None


class TeamReadWithHeroes(TeamRead):
    heroes: list[HeroRead] = []
