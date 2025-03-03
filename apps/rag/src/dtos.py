from pydantic import BaseModel
from dataclasses import dataclass
from typing import Dict, Any, Literal


class DocumentDto(BaseModel):
    id: int
    title: str
    authorId: int
    content: str


class QueryDocumentDto(BaseModel):
    query: str
    userId: int


@dataclass
class ResponseDataDto:
    userId: int
    token: str
    completed: bool


@dataclass
class QueryResponseDto:
    pattern: Literal["query.response"]
    data: ResponseDataDto

    def to_dict(self) -> Dict[str, Any]:
        return {
            "pattern": self.pattern,
            "data": {
                "userId": self.data.userId,
                "token": self.data.token,
                "completed": self.data.completed,
            },
        }


@dataclass
class ProcessedDocumentResponseDataDto:
    documentId: int


@dataclass
class ProcessedDocumentResponseDto:
    pattern: Literal["document.processed"]
    data: ProcessedDocumentResponseDataDto

    def to_dict(self) -> Dict[str, Any]:
        return {
            "pattern": self.pattern,
            "data": {
                "documentId": self.data.documentId,
            },
        }


@dataclass
class DeletedDocumentResponseDto(ProcessedDocumentResponseDto):
    pattern: Literal["document.deleted"]
