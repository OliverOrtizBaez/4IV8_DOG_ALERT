-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: alerta_canina
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alcaldia`
--

DROP TABLE IF EXISTS `alcaldia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alcaldia` (
  `id_alcaldia` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_alcaldia`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alcaldia`
--

LOCK TABLES `alcaldia` WRITE;
/*!40000 ALTER TABLE `alcaldia` DISABLE KEYS */;
INSERT INTO `alcaldia` VALUES (1,'Álvaro Obregón'),(2,'Azcapotzalco'),(3,'Benito Juárez'),(4,'Coyoacán'),(5,'Cuajimalpa de Morelos'),(6,'Cuauhtémoc'),(7,'Gustavo A. Madero'),(8,'Iztacalco'),(9,'Iztapalapa'),(10,'La Magdalena Contreras'),(11,'Miguel Hidalgo'),(12,'Milpa Alta'),(13,'Tláhuac'),(14,'Tlalpan'),(15,'Venustiano Carranza'),(16,'Xochimilco'),(17,'Álvaro Obregón'),(18,'Azcapotzalco'),(19,'Benito Juárez'),(20,'Coyoacán'),(21,'Cuajimalpa de Morelos'),(22,'Cuauhtémoc'),(23,'Gustavo A. Madero'),(24,'Iztacalco'),(25,'Iztapalapa'),(26,'La Magdalena Contreras'),(27,'Miguel Hidalgo'),(28,'Milpa Alta'),(29,'Tláhuac'),(30,'Tlalpan'),(31,'Venustiano Carranza'),(32,'Xochimilco');
/*!40000 ALTER TABLE `alcaldia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_falla`
--

DROP TABLE IF EXISTS `catalogo_falla`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_falla` (
  `id_falla` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`id_falla`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_falla`
--

LOCK TABLES `catalogo_falla` WRITE;
/*!40000 ALTER TABLE `catalogo_falla` DISABLE KEYS */;
INSERT INTO `catalogo_falla` VALUES (1,'Falla funcional (Botones no sirven, error al registrar datos)'),(2,'Falla de estética (Diseño roto, texto encimado)'),(3,'Problemas para iniciar sesión o registrarse'),(4,'Problemas al subir o visualizar fotografías'),(5,'Lentitud extrema en la aplicación');
/*!40000 ALTER TABLE `catalogo_falla` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_ojos`
--

DROP TABLE IF EXISTS `catalogo_ojos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_ojos` (
  `id_ojos` int NOT NULL AUTO_INCREMENT,
  `color` varchar(100) NOT NULL,
  PRIMARY KEY (`id_ojos`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_ojos`
--

LOCK TABLES `catalogo_ojos` WRITE;
/*!40000 ALTER TABLE `catalogo_ojos` DISABLE KEYS */;
INSERT INTO `catalogo_ojos` VALUES (1,'Café'),(2,'Negro'),(3,'Verde'),(4,'Azul'),(5,'Ámbar / Miel'),(6,'Heterocromía (Un ojo de cada color)');
/*!40000 ALTER TABLE `catalogo_ojos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_pelaje`
--

DROP TABLE IF EXISTS `catalogo_pelaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_pelaje` (
  `id_pelaje` int NOT NULL AUTO_INCREMENT,
  `color` varchar(100) NOT NULL,
  PRIMARY KEY (`id_pelaje`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_pelaje`
--

LOCK TABLES `catalogo_pelaje` WRITE;
/*!40000 ALTER TABLE `catalogo_pelaje` DISABLE KEYS */;
INSERT INTO `catalogo_pelaje` VALUES (1,'Blanco'),(2,'Negro'),(3,'Café'),(4,'Gris'),(5,'Dorado / Crema'),(6,'Manchado (Bicolor/Tricolor)'),(7,'Atigrado');
/*!40000 ALTER TABLE `catalogo_pelaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_raza`
--

DROP TABLE IF EXISTS `catalogo_raza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_raza` (
  `id_raza` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_raza`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_raza`
--

LOCK TABLES `catalogo_raza` WRITE;
/*!40000 ALTER TABLE `catalogo_raza` DISABLE KEYS */;
INSERT INTO `catalogo_raza` VALUES (1,'Mestizo / Criollo'),(2,'Husky Siberiano'),(3,'Pug'),(4,'Chihuahua'),(5,'Pitbull'),(6,'Golden Retriever'),(7,'Pastor Alemán'),(8,'Labrador Retriever'),(9,'Bulldog Francés'),(10,'Poodle (Caniche)'),(11,'Schnauzer'),(12,'Dóberman');
/*!40000 ALTER TABLE `catalogo_raza` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_tamano`
--

DROP TABLE IF EXISTS `catalogo_tamano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_tamano` (
  `id_tamano` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_tamano`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_tamano`
--

LOCK TABLES `catalogo_tamano` WRITE;
/*!40000 ALTER TABLE `catalogo_tamano` DISABLE KEYS */;
INSERT INTO `catalogo_tamano` VALUES (1,'Miniatura (Menos de 5 kg)'),(2,'Chico (5 a 10 kg)'),(3,'Mediano (11 a 25 kg)'),(4,'Grande (26 a 44 kg)'),(5,'Gigante (45 kg o más)');
/*!40000 ALTER TABLE `catalogo_tamano` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_tipo_pelaje`
--

DROP TABLE IF EXISTS `catalogo_tipo_pelaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_tipo_pelaje` (
  `id_tipo_pelaje` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(100) NOT NULL,
  PRIMARY KEY (`id_tipo_pelaje`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_tipo_pelaje`
--

LOCK TABLES `catalogo_tipo_pelaje` WRITE;
/*!40000 ALTER TABLE `catalogo_tipo_pelaje` DISABLE KEYS */;
INSERT INTO `catalogo_tipo_pelaje` VALUES (1,'Corto / Liso'),(2,'Largo'),(3,'Rizado'),(4,'Duro / Alambre'),(5,'Sin Pelo');
/*!40000 ALTER TABLE `catalogo_tipo_pelaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_tipo_usuario`
--

DROP TABLE IF EXISTS `catalogo_tipo_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_tipo_usuario` (
  `id_tipo_usuario` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(100) NOT NULL,
  PRIMARY KEY (`id_tipo_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_tipo_usuario`
--

LOCK TABLES `catalogo_tipo_usuario` WRITE;
/*!40000 ALTER TABLE `catalogo_tipo_usuario` DISABLE KEYS */;
INSERT INTO `catalogo_tipo_usuario` VALUES (1,'Dueño de mascota'),(2,'Rescatista o Albergue'),(3,'Invitado'),(4,'Soporte Técnico / Administrador');
/*!40000 ALTER TABLE `catalogo_tipo_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascota`
--

DROP TABLE IF EXISTS `mascota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascota` (
  `id_mascota` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `id_raza` int DEFAULT NULL,
  `id_pelaje` int DEFAULT NULL,
  `id_tamano` int DEFAULT NULL,
  `id_ojos` int DEFAULT NULL,
  `id_tipo_pelaje` int DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `tiene_collar` tinyint(1) DEFAULT '0',
  `ruac` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mascota`),
  UNIQUE KEY `ruac` (`ruac`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_raza` (`id_raza`),
  KEY `id_pelaje` (`id_pelaje`),
  KEY `id_tamano` (`id_tamano`),
  KEY `id_ojos` (`id_ojos`),
  KEY `id_tipo_pelaje` (`id_tipo_pelaje`),
  KEY `idx_mascota_ruac` (`ruac`),
  CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `mascota_ibfk_2` FOREIGN KEY (`id_raza`) REFERENCES `catalogo_raza` (`id_raza`),
  CONSTRAINT `mascota_ibfk_3` FOREIGN KEY (`id_pelaje`) REFERENCES `catalogo_pelaje` (`id_pelaje`),
  CONSTRAINT `mascota_ibfk_4` FOREIGN KEY (`id_tamano`) REFERENCES `catalogo_tamano` (`id_tamano`),
  CONSTRAINT `mascota_ibfk_5` FOREIGN KEY (`id_ojos`) REFERENCES `catalogo_ojos` (`id_ojos`),
  CONSTRAINT `mascota_ibfk_6` FOREIGN KEY (`id_tipo_pelaje`) REFERENCES `catalogo_tipo_pelaje` (`id_tipo_pelaje`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascota`
--

LOCK TABLES `mascota` WRITE;
/*!40000 ALTER TABLE `mascota` DISABLE KEYS */;
/*!40000 ALTER TABLE `mascota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idx_persona_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporte_alerta`
--

DROP TABLE IF EXISTS `reporte_alerta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_alerta` (
  `id_reporte_alerta` int NOT NULL AUTO_INCREMENT,
  `id_mascota` int NOT NULL,
  `id_ubicacion_extravio` int NOT NULL,
  `esta_validado` tinyint(1) DEFAULT '0',
  `recompensa` decimal(10,2) DEFAULT '0.00',
  `comentarios` text,
  `fecha_expedicion` date NOT NULL,
  `fecha_caducidad` date DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_reporte_alerta`),
  KEY `id_mascota` (`id_mascota`),
  KEY `id_ubicacion_extravio` (`id_ubicacion_extravio`),
  KEY `idx_reporte_fechas` (`fecha_expedicion`,`fecha_caducidad`),
  CONSTRAINT `reporte_alerta_ibfk_1` FOREIGN KEY (`id_mascota`) REFERENCES `mascota` (`id_mascota`) ON DELETE CASCADE,
  CONSTRAINT `reporte_alerta_ibfk_2` FOREIGN KEY (`id_ubicacion_extravio`) REFERENCES `ubicacion` (`id_ubicacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporte_alerta`
--

LOCK TABLES `reporte_alerta` WRITE;
/*!40000 ALTER TABLE `reporte_alerta` DISABLE KEYS */;
/*!40000 ALTER TABLE `reporte_alerta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporte_tecnico`
--

DROP TABLE IF EXISTS `reporte_tecnico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_tecnico` (
  `id_reporte_tecnico` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_falla` int NOT NULL,
  `fecha_incidencia` date NOT NULL,
  `retroalimentacion` text NOT NULL,
  `atendido` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_reporte_tecnico`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_falla` (`id_falla`),
  CONSTRAINT `reporte_tecnico_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL,
  CONSTRAINT `reporte_tecnico_ibfk_2` FOREIGN KEY (`id_falla`) REFERENCES `catalogo_falla` (`id_falla`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporte_tecnico`
--

LOCK TABLES `reporte_tecnico` WRITE;
/*!40000 ALTER TABLE `reporte_tecnico` DISABLE KEYS */;
/*!40000 ALTER TABLE `reporte_tecnico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ubicacion`
--

DROP TABLE IF EXISTS `ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ubicacion` (
  `id_ubicacion` int NOT NULL AUTO_INCREMENT,
  `id_alcaldia` int NOT NULL,
  `codigo_postal` varchar(10) NOT NULL,
  `colonia` varchar(255) DEFAULT NULL,
  `calle` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_ubicacion`),
  KEY `fk_ubicacion_alcaldia` (`id_alcaldia`),
  CONSTRAINT `fk_ubicacion_alcaldia` FOREIGN KEY (`id_alcaldia`) REFERENCES `alcaldia` (`id_alcaldia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ubicacion`
--

LOCK TABLES `ubicacion` WRITE;
/*!40000 ALTER TABLE `ubicacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `id_tipo_usuario` int NOT NULL,
  `id_ubicacion` int DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  KEY `id_persona` (`id_persona`),
  KEY `id_tipo_usuario` (`id_tipo_usuario`),
  KEY `id_ubicacion` (`id_ubicacion`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE,
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `catalogo_tipo_usuario` (`id_tipo_usuario`),
  CONSTRAINT `usuario_ibfk_3` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 15:49:21
