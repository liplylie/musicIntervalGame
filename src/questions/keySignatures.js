// Flats
const ZeroFlat = require("../../assets/keySignatures/ZeroFlat.png");
const OneFlat = require("../../assets/keySignatures/OneFlat.png");
const TwoFlat = require("../../assets/keySignatures/TwoFlat.png");
const ThreeFlat = require("../../assets/keySignatures/ThreeFlat.png");
const FourFlat = require("../../assets/keySignatures/FourFlat.png");
const FiveFlat = require("../../assets/keySignatures/FiveFlat.png");
const SixFlat = require("../../assets/keySignatures/SixFlat.png");
const SevenFlat = require("../../assets/keySignatures/SevenFlat.png");

// Sharp
const OneSharp = require("../../assets/keySignatures/OneSharp.png");
const TwoSharp = require("../../assets/keySignatures/TwoSharp.png");
const ThreeSharp = require("../../assets/keySignatures/ThreeSharp.png");
const FourSharp = require("../../assets/keySignatures/FourSharp.png");
const FiveSharp = require("../../assets/keySignatures/FiveSharp.png");
const SixSharp = require("../../assets/keySignatures/SixSharp.png");
const SevenSharp = require("../../assets/keySignatures/SevenSharp.png");

export default {
  major: {
    "C Major": ZeroFlat,
    "F Major": OneFlat,
    "Bb Major": TwoFlat,
    "Eb Major": ThreeFlat,
    "Ab Major": FourFlat,
    "Db Major": FiveFlat,
    "Gb Major": SixFlat,
    "Cb Major": SevenFlat,
    "G Major": OneSharp,
    "D Major": TwoSharp,
    "A Major": ThreeSharp,
    "E Major": FourSharp,
    "B Major": FiveSharp,
    "F# Major": SixSharp,
    "C# Major": SevenSharp
  },
  minor: {
    "A Minor": ZeroFlat,
    "D Minor": OneFlat,
    "G Minor": TwoFlat,
    "C Minor": ThreeFlat,
    "F Minor": FourFlat,
    "Bb Minor": FiveFlat,
    "Eb Minor": SixFlat,
    "Cb Minor": SevenFlat,
    "E Minor": OneSharp,
    "B Minor": TwoSharp,
    "F# Minor": ThreeSharp,
    "C# Minor": FourSharp,
    "G# Minor": FiveSharp,
    "D# Minor": SixSharp,
    "C# Minor": SevenSharp
  }
};
