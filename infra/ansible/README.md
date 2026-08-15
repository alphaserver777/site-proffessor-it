# Professor IT: воспроизводимый web-host

Контур разворачивает маркетинговый сайт и четырёхчастный лонгрид на чистой
Ubuntu 24.04 LTS. Единственная привязка к площадке — IP в inventory; playbook
одинаково работает в Proxmox и на обычном VPS.

## Первый запуск

```bash
cd infra/ansible
ansible-playbook provision.yml
```

## Публикация релиза

```bash
cd infra/ansible
./deploy.sh
```

Сборка выполняется в зафиксированном контейнере Node.js, поэтому Node/npm не
нужно устанавливать на рабочую машину или production-сервер.

Для установки Ansible на новой управляющей машине:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
ansible-galaxy collection install -r requirements.yml
```

Релизы находятся в `/srv/professorit/releases`, активный релиз подключён через
атомарную ссылку `/srv/professorit/current`. Хранятся пять последних версий.

## Проверка без переключения DNS

```bash
curl -I -H 'Host: professorit.ru' http://192.168.50.111/
curl -I -H 'Host: professorit.ru' http://192.168.50.111/guide/kak-voiti-v-it/
```

TLS и публичное переключение выполняются отдельным этапом после локальной
проверки всех страниц. До переноса backend маршрут `/api/public/*` проксируется
на действующий production edge с корректными Host и SNI.

## Включение HTTPS после переключения маршрута

Сначала направьте публичные TCP-порты `80` и `443` на VM, затем измените A-записи
`professorit.ru` и `www.professorit.ru` на российский публичный IP. Когда оба
имени разрешаются в новый адрес:

```bash
cd infra/ansible
ansible-playbook enable-tls.yml
```

Certbot использует HTTP-01 webroot без остановки контейнера. Обновление
сертификата выполняет системный `certbot.timer`, deploy-hook перечитывает
сертификат внутри Nginx.
