# send-all-webmentions

A small utility which takes a list of URL, scrapes the links, and doles out the webmentions.

Returns a map of the sources URLs, mapped to another map of the target URLs, mapped to a structure
holding the status code.  If the webmention was suvvessful, we also return the location header,
useful in services like [bridgy](https://brid.gy/) that do syndication.
