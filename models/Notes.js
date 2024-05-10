const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Notes = sequelize.define('Notes', {
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    noteTitle: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    displayPicture: {
        type: DataTypes.BLOB, 
    },
    notesAttachment: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    notesType: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    numberOfPages: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    notesDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    universityInformation: {
        type: DataTypes.STRING(200),
    },
    country: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    courseInformation: {
        type: DataTypes.STRING(100),
    },
    courseCode: {
        type: DataTypes.STRING(100),
    },
    professorLecturer: {
        type: DataTypes.STRING(100),
    },
    sellFor: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    sellPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    previewUpload: {
        type: DataTypes.BLOB, 
    },
    statusFlag: {
        type: DataTypes.STRING(3),
    },
    publishFlag: {
        type: DataTypes.STRING(3),
    },
    displayPictureP: {
        type: DataTypes.STRING(350), 
        allowNull: true
    },
    notesAttachmentP: {
        type: DataTypes.STRING(350), 
        allowNull: true
    },
    previewUploadP: {
        type: DataTypes.STRING(350), 
        allowNull: true
    },
}, {
    timestamps: true,
});

module.exports = Notes;
