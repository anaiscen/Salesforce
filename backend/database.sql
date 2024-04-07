-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema salesforce
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema salesforce
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `salesforce` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `salesforce` ;

-- -----------------------------------------------------
-- Table `salesforce`.`company`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`company` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`company` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `companyName` VARCHAR(150) NOT NULL,
  `nSiret` VARCHAR(45) NOT NULL,
  `creationDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `contactPerson` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `companyLogo` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`category` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `companyCategoryId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `company_category_id_idx` (`companyCategoryId` ASC) VISIBLE,
  CONSTRAINT `companyCategoryId`
    FOREIGN KEY (`companyCategoryId`)
    REFERENCES `salesforce`.`company` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`picturestorage`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`picturestorage` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`picturestorage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `src` VARCHAR(1000) NOT NULL,
  `alt` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`idea`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`idea` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`idea` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(120) NOT NULL,
  `text` VARCHAR(4000) NOT NULL,
  `createDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `categoryId` INT NULL DEFAULT NULL,
  `pictureId` INT NULL DEFAULT NULL,
  `archived` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `picture_id_idx` (`pictureId` ASC) VISIBLE,
  INDEX `company_idea_id_idx` (`categoryId` ASC, `pictureId` ASC) VISIBLE,
  CONSTRAINT `categoryId`
    FOREIGN KEY (`categoryId`)
    REFERENCES `salesforce`.`category` (`id`)
    ON DELETE RESTRICT,
  CONSTRAINT `pictureid`
    FOREIGN KEY (`pictureId`)
    REFERENCES `salesforce`.`picturestorage` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`commentary`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`commentary` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`commentary` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(2000) NOT NULL,
  `createDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `ideaCommentaryId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idea_commentary_id_idx` (`ideaCommentaryId` ASC) VISIBLE,
  CONSTRAINT `ideaCommentaryId`
    FOREIGN KEY (`ideaCommentaryId`)
    REFERENCES `salesforce`.`idea` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`role` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`subcommentary`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`subcommentary` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`subcommentary` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(2000) NULL DEFAULT NULL,
  `createDate` DATE NULL DEFAULT NULL,
  `subCommentaryCommentaryId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `commentarySubCommentaryId_idx` (`subCommentaryCommentaryId` ASC) VISIBLE,
  CONSTRAINT `commentarySubCommentaryId`
    FOREIGN KEY (`subCommentaryCommentaryId`)
    REFERENCES `salesforce`.`commentary` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`team`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`team` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`team` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `companyId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `team_company_id_idx` (`companyId` ASC) VISIBLE,
  CONSTRAINT `teamCompanyId`
    FOREIGN KEY (`companyId`)
    REFERENCES `salesforce`.`company` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`user` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `dateOfBirth` VARCHAR(10) NOT NULL,
  `hashedPassword` VARCHAR(255) NOT NULL,
  `liked` TINYINT NULL DEFAULT NULL,
  `profilePicture` VARCHAR(255) NULL DEFAULT NULL,
  `creationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `roleId` INT NULL DEFAULT NULL,
  `teamId` INT NULL DEFAULT NULL,
  `token` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `role_id_idx` (`roleId` ASC) VISIBLE,
  INDEX `user_team_id_idx` (`teamId` ASC) VISIBLE,
  CONSTRAINT `teamUserId`
    FOREIGN KEY (`teamId`)
    REFERENCES `salesforce`.`team` (`id`),
  CONSTRAINT `userRoleId`
    FOREIGN KEY (`roleId`)
    REFERENCES `salesforce`.`role` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`usercommentary`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`usercommentary` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`usercommentary` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `liked` TINYINT NULL DEFAULT NULL,
  `postCreator` TINYINT NULL DEFAULT NULL,
  `commentarytaryId` INT NOT NULL,
  `userId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_commentary_user_id_idx` (`userId` ASC) VISIBLE,
  INDEX `user_commentary_commentary_id_idx` (`commentarytaryId` ASC) VISIBLE,
  CONSTRAINT `userCommentaryCommentaryId`
    FOREIGN KEY (`commentarytaryId`)
    REFERENCES `salesforce`.`commentary` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `userCommentaryUserId`
    FOREIGN KEY (`userId`)
    REFERENCES `salesforce`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `salesforce`.`useridea`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `salesforce`.`useridea` ;

CREATE TABLE IF NOT EXISTS `salesforce`.`useridea` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `liked` TINYINT NOT NULL,
  `postCreator` TINYINT NULL DEFAULT '1',
  `ideaId` INT NOT NULL,
  `userId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idea_user_id_idx` (`ideaId` ASC) VISIBLE,
  INDEX `user_idea_id_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `ideaUserId`
    FOREIGN KEY (`ideaId`)
    REFERENCES `salesforce`.`idea` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `userIdeaId`
    FOREIGN KEY (`userId`)
    REFERENCES `salesforce`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO company (companyName, nSiret, creationDate, contactPerson, email, phone)
VALUES ('Salesforce', '10', '2019-12-31', 'Bob', 'bob@mail.com', "0123456789");

INSERT INTO team (`name`, `companyId`)
VALUES ('Admin Salesforce', 1);

INSERT INTO role (name)
VALUES ('Salesforce'), ('Admin'), ('Membre'), ('Exclu');

INSERT INTO user (firstname, lastname, email, dateOfBirth, hashedPassword, liked, profilePicture, creationDate, roleId, teamId)
VALUES ('Bob', 'Martin', 'bob@mail.com', '2020-01-01', 'Azerty11@', '10', '10', '2020-01-01', '1', '1');

INSERT INTO picturestorage (src, alt)
VALUES
  ('https://img.freepik.com/photos-gratuite/laboratoire-informatique-moderne-equipe_23-2149241232.jpg?w=1380&t=st=1686058091~exp=1686058691~hmac=089abd2743ef423d37292f7b8a40872c282417e7afb1ae89f24dfcac9d654bd0', 'Mentorat'),
  ('https://img.freepik.com/photos-gratuite/femme-lors-videoconference-dans-son-bureau-domicile-pendant-pandemie-coronavirus_53876-143092.jpg?w=1380&t=st=1686058154~exp=1686058754~hmac=fdfa81a3dda77bc364667740bb4456c1a32dbe2319f1d304bbc612fa21ebf34e', 'Daily en télétravail'),
  ('https://img.freepik.com/photos-gratuite/reunion-employes-entreprise-equipe-personnes-appel-video-ligne-webcam-ordinateur-parlons-du-rapport-demarrage-teletravail-visioconference-distance-telecommunications_482257-47673.jpg?w=1380&t=st=1686058130~exp=1686058730~hmac=05b15ad2dfbb52c0e6d14c6dbe52fabdd73ffe48dc544993f99b14e131b35ff8', 'Réunion en télétravail'),
  ('https://img.freepik.com/photos-gratuite/gens-affaires-entreprise_23-2148827020.jpg?w=1380&t=st=1686058254~exp=1686058854~hmac=dc87d74573779e9dcacc67f1fcd680f5bd949b95203e6c399c4119f1c0a79b85', "Entretien d'embauche"),
  ('https://img.freepik.com/photos-gratuite/coup-moyen-hommes-transportant-boite_23-2149392120.jpg?w=1380&t=st=1686058319~exp=1686058919~hmac=db612d783cd77564d503765b22b7846299da579b29d5f19212a2c8b2746cbfff', 'Prise de poste'),
  ('https://img.freepik.com/photos-gratuite/restaurant-typiquement-francais-tables-chaises_1147-445.jpg?w=1380&t=st=1686058194~exp=1686058794~hmac=1fba3358d206d9e8f068036ad8170e3b60e8ad34ca1bbc4dbfd30d17b6102714', 'Sortie restaurant'),
  ('https://img.freepik.com/photos-gratuite/celebrer-nouvel-an_1098-12620.jpg?w=1380&t=st=1686058526~exp=1686059126~hmac=b7c9c0a9ce0c6060b9fafe7b7965092c1b0037d5e261206282fdaae10b0aa765', 'Champagne'),
  ('https://img.freepik.com/photos-gratuite/je-n-aurais-pas-reussi-sans-votre-soutien_637285-9621.jpg?w=1380&t=st=1686058532~exp=1686059132~hmac=b5d880061cf2eb145bcf932ffd63f4820c8bb0d5b6b4691ba94815cd1608af85', 'Pot de départ'),
  ('https://img.freepik.com/photos-gratuite/close-up-gens-affaires-travaillant-documents_1098-1263.jpg?w=1380&t=st=1687342111~exp=1687342711~hmac=6b44c71e42ad4918406f5084e3a7139a0a1cbbcc1e4f04141b86b96d660604de', "Statistique"),
  ('https://img.freepik.com/photos-gratuite/vue-laterale-femmes-travaillant-post-its_23-2149871360.jpg?w=1380&t=st=1687342229~exp=1687342829~hmac=1ec3ebac0fc8d9db0b45f204bf06b5e9ce156574c3e8c87b150514e789f7806e', 'Post-it'),
  ('https://img.freepik.com/photos-gratuite/contexte-programmation-personne-travaillant-codes-ordinateur_23-2150010125.jpg?size=626&ext=jpg&ga=GA1.1.1289780400.1670411880&semt=ais', 'Code'),
  ('https://img.freepik.com/photos-gratuite/vue-face-gens-affaires-reunion_23-2148427096.jpg?w=1060&t=st=1686058238~exp=1686058838~hmac=56edf68648f83717545c8926d6d6a42f73260a933c4ad9f162dbcfad7617fd4a', "Conseil d'entreprise");

