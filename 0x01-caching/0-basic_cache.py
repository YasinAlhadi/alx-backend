#!/usr/bin/python3
"""Basic dictionary"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """Basic caching class"""

    def put(self, key, item):
        """assing item, key to cache_data"""
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """return the value in cache_data"""
        if key in self.cache_data:
            return self.cache_data[key]
        return None
