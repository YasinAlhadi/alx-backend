#!/usr/bin/python3
"""LFU python Cache"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """LFUCache caching class"""

    def __init__(self):
        """initialize"""
        super().__init__()
        self.queue = []
        self.count = {}

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
            if key in self.count:
                self.count[key] += 1
            else:
                self.count[key] = 1

    def get(self, key):
        """ Get an item by key """
        if key in self.cache_data:
            self.queue.remove(key)
            self.queue.append(key)
            self.count[key] += 1
            return self.cache_data[key]
        return None
