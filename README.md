# Food Forest Informatie Platform — Backend

## Overzicht
Deze repository bevat de backend van het Food Forest Informatie Platform.
De backend verzorgt data-beheer, API-endpoints, database-migraties en biedt de basis voor huidige en toekomstige microservices.
Via de backend kan de frontend communiceren en data opslaan/opvragen (bijvoorbeeld over voedselbossen, sensordata, bos-statussen, etc.).

## Doelen van de Backend  
De backend is gemaakt voo de volgende doeleinden:

- Bieden van een stabiele API-laag voor communicatie tussen frontend en dataopslag.
- Beheren van database migraties / updates.
- Ondersteunen van CRUD-operaties voor alle relevante datatypes (bijv. bossen, planten, user accounts etc.).
- Ondersteunen van (toekomstige) microservice-architectuur om uitbreidbaarheid en onderhoud te versimpelen.
- Zorgen voor gestructureerde code, zodat verdere functionaliteit (bijv. data-analyse) eenvoudig toegevoegd kan worden.

## Huidige Structuur & Technische Opzet
De backend maakt gebruik van:

- Node.js (JavaScript)
- REST / API-gateway-architectuur met microservices (t.b.d.)
- Docker (met docker-compose)

## Installatie en Lokale Setup

1. Clone de repository
   ```bash
   git clone <url-van-de-repo>
   ```
2. Ga naar de projectmappen, installeer dependencies:
   ```bash
   npm install
   ```
3. bouw en start containers:
   ```bash
   docker-compose up
   ```
4. De server / API-gateway zal starten op de aangegeven poort. Je kunt dan API-verzoeken sturen (GET, POST, PUT, DELETE, etc.) om data aan te maken, op te vragen of te wijzigen.

## Functionaliteiten (vooralsnog / gepland)
- Basis CRUD-functionaliteit voor bosdata, plantendata en statusinformatie
- API-endpoints voor communicatie met de frontend
- Gestructureerde codeopzet die schaalbaarheid en uitbreiding ondersteunt

## Toekomst en Uitbreiding
- Toevoegen van extra microservices met onafhankelijke taken (zoals sensordata en communicatie binnen de applicatie voor gebruikers)
- Eventuele implementatie van authenticatie en autorisatie
- Verbetering van beveiliging en validatie d.m.v. middleware

## Schema aanpassen
- Als je de schema wil aanpassen, doe dit dan in forests/prisma/schema.prisma.
- Daarna kan je het formatten met `docker exec -it forests npx prisma format` en een migration aanmaken `docker exec -it forests npx prisma migrate dev`
- Dan moet je ook nog  `docker exec -it forests npx prisma generate` doen. Of je kan de docker service herstarten.
- Als je veranderingen maakt die ook voor de gateway uit maken, moet je ook die service herstarten (of `docker exec -it api-gateway npx prisma generate`).
