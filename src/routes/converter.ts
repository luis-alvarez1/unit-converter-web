import express from "express";
import {
    convertLength,
    convertWeight,
    convertTemperature,
    getUnits,
} from "../services/converter";

const router = express.Router();

interface ConversionRequest {
    value: number;
    fromUnit: string;
    toUnit: string;
}

router.get("/units/:type", (req, res) => {
    try {
        const units = getUnits(req.params.type);
        res.json(units);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post("/convert/:type", (req, res) => {
    try {
        const { value, fromUnit, toUnit } = req.body as ConversionRequest;
        let result: number;

        switch (req.params.type) {
            case "length":
                result = convertLength(value, fromUnit, toUnit);
                break;
            case "weight":
                result = convertWeight(value, fromUnit, toUnit);
                break;
            case "temperature":
                result = convertTemperature(value, fromUnit, toUnit);
                break;
            default:
                throw new Error("Invalid conversion type");
        }

        res.json({
            result:
                req.params.type === "temperature"
                    ? Number(result.toFixed(1))
                    : Number(result.toFixed(2)),
            fromUnit,
            toUnit,
            originalValue: value,
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
