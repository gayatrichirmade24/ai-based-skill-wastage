from uuid import uuid4

from pymongo import MongoClient
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError


class InsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class SafeCollection:
    def __init__(self, mongo_collection, name: str):
        self.mongo_collection = mongo_collection
        self.name = name
        self.memory_items = []
        self.use_memory = False

    def insert_one(self, document: dict):
        document = dict(document)
        try:
            result = self.mongo_collection.insert_one(document)
            self.use_memory = False
            return result
        except (PyMongoError, ServerSelectionTimeoutError):
            self.use_memory = True
            return self._insert_memory(document)

    def find_one(self, query: dict, sort=None):
        try:
            result = self.mongo_collection.find_one(query, sort=sort)
            self.use_memory = False
            return result
        except (PyMongoError, ServerSelectionTimeoutError):
            self.use_memory = True
            return self._find_memory(query, sort)

    def find_many(self, query: dict, sort=None, limit: int = 20):
        try:
            cursor = self.mongo_collection.find(query)
            if sort:
                cursor = cursor.sort(sort)
            if limit:
                cursor = cursor.limit(limit)
            self.use_memory = False
            return list(cursor)
        except (PyMongoError, ServerSelectionTimeoutError):
            self.use_memory = True
            return self._find_many_memory(query, sort, limit)

    def delete_one(self, query: dict):
        if self.use_memory:
            return self._delete_memory(query)

        try:
            result = self.mongo_collection.delete_one(query)
            self.use_memory = False
            return result
        except (PyMongoError, ServerSelectionTimeoutError):
            self.use_memory = True
            return self._delete_memory(query)

    def _insert_memory(self, document: dict):
        document["_id"] = str(uuid4())
        self.memory_items.append(document)
        return InsertResult(document["_id"])

    def _find_memory(self, query: dict, sort=None):
        matches = [
            item
            for item in self.memory_items
            if all(item.get(key) == value for key, value in query.items())
        ]

        if not matches:
            return None

        if sort:
            field, direction = sort[0]
            matches = sorted(matches, key=lambda item: str(item.get(field, "")), reverse=direction < 0)

        return dict(matches[0])

    def _find_many_memory(self, query: dict, sort=None, limit: int = 20):
        matches = [
            dict(item)
            for item in self.memory_items
            if all(item.get(key) == value for key, value in query.items())
        ]

        if sort:
            field, direction = sort[0]
            matches = sorted(matches, key=lambda item: str(item.get(field, "")), reverse=direction < 0)

        return matches[:limit] if limit else matches

    def _delete_memory(self, query: dict):
        before_count = len(self.memory_items)
        self.memory_items = [
            item
            for item in self.memory_items
            if not all(item.get(key) == value for key, value in query.items())
        ]

        class DeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count

        return DeleteResult(before_count - len(self.memory_items))


client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
db = client["skill_wastage"]

users_collection = SafeCollection(db["users"], "users")
resume_collection = SafeCollection(db["resumes"], "resumes")
result_collection = SafeCollection(db["results"], "results")
