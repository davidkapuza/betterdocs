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
class DocumentDto(BaseDto):
    id: int
    authorId: int
    title: str
    authorId: int
    content: str


@dataclass
class QueryDocumentDto(BaseDto):
    query: str
    userId: int


@dataclass
class DeleteDocumentDto(BaseDto):
    documentId: int
    userId: int


@dataclass
class ResponseDataDto(BaseDto):
    userId: int
    token: str
    completed: bool


@dataclass
class QueryResponseDto(BaseDto):
    pattern: Literal["query.response"]
    data: ResponseDataDto


@dataclass
class ProcessedDocumentResponseDataDto(BaseDto):
    documentId: int


@dataclass
class ProcessedDocumentResponseDto(BaseDto):
    pattern: Literal["document.processed"]
    data: ProcessedDocumentResponseDataDto


@dataclass
class DeletedDocumentResponseDto(ProcessedDocumentResponseDto):
    pattern: Literal["document.deleted"]
