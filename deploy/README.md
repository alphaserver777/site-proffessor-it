# Production deployment

The public path is:

`professorit.ru → Traefik on robots-dev1 → TCP forwarder → site container in VM`.

The container listens only on the VM-private interface at
`192.168.122.10:18080`. Public TLS and domain routing are owned by Traefik on
the host. The TCP forwarder is a transport bridge to the VM; there is no
additional VM Nginx proxy between Traefik and the static site.

Deploy or update from a checked-out working tree:

```bash
docker compose -f deploy/docker-compose.yml up -d
```
