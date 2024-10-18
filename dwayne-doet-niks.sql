CREATE TABLE Klanten (
  id INT PRIMARY KEY,
  voornaam VARCHAR(50) NOT NULL,
  tussen_voegsel VARCHAR(10),
  achternaam VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefoon_nummer VARCHAR(20),
  geslacht VARCHAR(10) CHECK (geslacht IN ('M', 'V', 'O')),
  leeftijd INT CHECK (leeftijd >= 0),
  jaar_inkomen DECIMAL(10, 2),
  huidig_adres TEXT,
  wachtwoord VARCHAR(255) NOT NULL,
  email_verificatie_datum DATE,
  leeftijd_verificatie_datum DATE,
  user_aanmaak_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  opmerkingen TEXT
);

CREATE TABLE Panden (
  id INT PRIMARY KEY,
  straat VARCHAR(100) NOT NULL,
  huisnummer VARCHAR(10) NOT NULL,
  bij_voegsel VARCHAR(10),
  postcode VARCHAR(10) NOT NULL,
  plaats VARCHAR(50) NOT NULL,
  fotos TEXT,  -- Dit kan een JSON-string zijn of een pad naar afbeeldingen
  prijs DECIMAL(10, 2) NOT NULL,
  beschrijving TEXT,
  oppervlakte_m2 DECIMAL(10, 2),
  energie_label VARCHAR(10),
  slaapkamers INT CHECK (slaapkamers >= 0),
  aangeboden_sinds DATE NOT NULL,
  soort_woonhuis VARCHAR(50) NOT NULL
);

CREATE TABLE Service_Typen (
  id INT PRIMARY KEY,
  omschrijving VARCHAR(255) NOT NULL
);

CREATE TABLE Service_Verzoeken (
  id INT PRIMARY KEY,
  omschrijving TEXT NOT NULL,
  contract_id INT NOT NULL,
  service_id INT NOT NULL,
  datum_aanvraag DATE NOT NULL,
  datum_afhandeling DATE,
  straat VARCHAR(100),
  prijs DECIMAL(10, 2),
  betaald BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (contract_id) REFERENCES Contracten(id),  -- Verbindt met de Contracten tabel
  FOREIGN KEY (service_id) REFERENCES Service_Typen(id)  -- Verbindt met de Service_Typen tabel
);

CREATE TABLE Service_Stappen (
  id INT PRIMARY KEY,
  omschrijving TEXT NOT NULL,
  serviceverzoek_id INT NOT NULL,
  externepartijd_id INT NOT NULL,
  datum_uitvoering DATE NOT NULL,
  FOREIGN KEY (serviceverzoek_id) REFERENCES Service_Verzoeken(id),  -- Verbindt met de Service_Verzoeken tabel
  FOREIGN KEY (externepartijd_id) REFERENCES Externe_Partijen(id)   -- Verbindt met de Externe_Partijen tabel
);

CREATE TABLE Externe_Partijen (
  id INT PRIMARY KEY,
  bedrijf_naam VARCHAR(255) NOT NULL,
  contact_persoon VARCHAR(255),
  e_mail_bedrijf VARCHAR(191) UNIQUE,
  telefoon_nummer_bedrijf VARCHAR(20),
  e_mail_contactp VARCHAR(191),
  telefoon_contactp VARCHAR(20),
  servicetype_id INT,
  FOREIGN KEY (servicetype_id) REFERENCES Service_Typen(id)  -- Verbindt met de Service_Typen tabel
);

CREATE TABLE Contracten (
  id INT PRIMARY KEY,
  pand_id INT NOT NULL,
  klant_id INT NOT NULL,
  teken_datum DATE NOT NULL,
  verval_datum DATE,
  FOREIGN KEY (pand_id) REFERENCES Panden(id),  -- Verbindt met de Panden tabel
  FOREIGN KEY (klant_id) REFERENCES Klanten(id)  -- Verbindt met de Klanten tabel
);

CREATE TABLE Medewerkers (
  id INT PRIMARY KEY,
  voornaam VARCHAR(100) NOT NULL,
  tussenvoegsel VARCHAR(50),
  achternaam VARCHAR(100) NOT NULL,
  e_mail VARCHAR(191) UNIQUE NOT NULL,  -- Verkorte lengte
  werk_uren DECIMAL(5, 2) NOT NULL,  -- Aantal werkuren per week
  leeftijd INT CHECK (leeftijd >= 0),  -- Leeftijd moet positief zijn
  wachtwoord VARCHAR(255) NOT NULL,  -- Voorzien van encryptie in de applicatie
  telefoon_nummer VARCHAR(20),
  geslacht CHAR(1) CHECK (geslacht IN ('M', 'V', 'O')),  -- M voor man, V voor vrouw, O voor overig
  in_dienst_sinds DATE NOT NULL,
  contract_verval_datum DATE,
  huidig_adres VARCHAR(255),
  opmerkingen TEXT
);

CREATE TABLE Inschrijvingen (
  inschrijving_id INT PRIMARY KEY,
  pand_id INT NOT NULL,
  klant_id INT NOT NULL,
  klant_jaar_inkomen DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (pand_id) REFERENCES Panden(id),  -- Verbindt met de Panden tabel
  FOREIGN KEY (klant_id) REFERENCES Klanten(id)  -- Verbindt met de Klanten tabel
);