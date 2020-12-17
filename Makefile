VERSION := $$(cat package.json | grep version | sed 's/"/ /g' | awk {'print $$3'})

DEV := env.json
ENV := $(DEV)

MONDAY_TOKEN := $$(cat $(ENV) | grep MONDAY_TOKEN | sed 's/"/ /g' | awk {'print $$3'})

SVC=portal-inmobiliario-scraping
PORT=8000

version v:
	@echo $(VERSION)

init i:
	@echo "[Dependencies] Installing dependencies"
	@npm install

run r:
	@echo "[Scraping] Scraping service "
	@PORT=$(PORT) MONDAY_TOKEN="$(MONDAY_TOKEN)" node index.js
	
.PHONY: version v init i run r