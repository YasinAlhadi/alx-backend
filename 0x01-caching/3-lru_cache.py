#!/usr/bin/python3
"""LRU caching"""

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """LRUCache caching class"""

    def __init__(self):
        """initialize"""
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """assing item, key to cache_data"""
        if key and item:
            if key in self.cache_data:
                self.queue.remove(key)
            elif len(self.cache_data) >= self.MAX_ITEMS:
                discard = self.queue.pop(0)
                del self.cache_data[discard]
                print("DISCARD: {}".format(discard))
            self.queue.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key """
        if key in self.cache_data:
            self.queue.remove(key)
            self.queue.append(key)
            return self.cache_data[key]
        return None
