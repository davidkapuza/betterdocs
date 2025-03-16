from dataclasses import dataclass, asdict
from typing import Optional, List, Union, Literal
import inspect


@dataclass
class BaseDto:
    @classmethod
    def from_dict(cls, params):
        return cls(
            **{
                k: v
                for k, v in params.items()
                if k in inspect.signature(cls).parameters
            }
        )

    def to_dict(self, exclude: Optional[Union[str, List[str]]] = None):
        if isinstance(exclude, str):
            exclude = [exclude]

        dict_repr = asdict(self)

        if exclude:
            for field in exclude:
                dict_repr.pop(field, None)

        return dict_repr


@dataclass
class QueryCollectionDto(BaseDto):
    query: str
    collectionId: int
    userId: int


@dataclass
class ResponseDataDto(BaseDto):
    userId: int
    token: str
    completed: bool


@dataclass
class QueryCollectionResponseDto(BaseDto):
    pattern: Literal["query.response"]
    data: ResponseDataDto
