# Makefile to run backend and frontend dev servers together
# Uses npx concurrently to run both in one terminal

.PHONY: dev backend frontend

dev: backend/node_modules frontend/node_modules
	# Runs both dev commands and kills the other process if one exits
	npx concurrently --kill-others "npm --prefix frontend run dev" "npm --prefix backend run dev"


backend/node_modules:
	cd backend && npm install

frontend/node_modules:
	cd frontend && npm install

backend:
	cd backend && npm run dev

frontend:
	cd frontend && npm run dev

clean:
	cd frontend && rm -rf node_modules package-lock.json
	cd backend && rm -rf node_modules package-lock.json