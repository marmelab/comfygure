install:
	cd api && make install
	cd cli && make install

test:
	cd api && make test
	cd cli && make test
