# Observabilité de SecureShop

## Disponibilité

SecureShop utilise le mécanisme HEALTHCHECK de Docker afin de contrôler périodiquement la disponibilité de l'application.

Commande de contrôle :

docker inspect --format='Status={{.State.Status}} | Health={{.State.Health.Status}}' secureshop-container

Un état `Health=healthy` indique que l'application répond correctement.

## Logs

Les journaux du conteneur peuvent être consultés avec :

docker logs secureshop-container

ou suivis en temps réel avec :

docker logs -f secureshop-container

Ils permettent notamment de contrôler le démarrage du serveur et d'identifier d'éventuelles erreurs d'exécution.

## Métriques

Les ressources consommées par le conteneur peuvent être consultées avec :

docker stats --no-stream secureshop-container

Les principales informations surveillées sont :

- utilisation CPU ;
- consommation mémoire ;
- trafic réseau ;
- entrées/sorties disque ;
- nombre de processus.

## Alertes

Dans un environnement de production, des alertes pourraient être déclenchées notamment lorsque :

- le conteneur devient unhealthy ;
- l'application devient indisponible ;
- l'utilisation CPU ou mémoire dépasse un seuil défini ;
- des erreurs répétées apparaissent dans les logs.

## Évolutions possibles

Pour un environnement de production plus avancé, le dispositif pourrait être complété par :

- Prometheus pour la collecte des métriques ;
- Grafana pour la visualisation ;
- Alertmanager pour les alertes ;
- une solution centralisée de collecte des logs.
