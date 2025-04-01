interface ConversionRates {
    [key: string]: number;
}

const lengthConversions: ConversionRates = {
    cm: 1,
    m: 100,
    ft: 30.48,
    in: 2.54,
};

const weightConversions: ConversionRates = {
    g: 1,
    kg: 1000,
    lb: 453.592,
    oz: 28.3495,
};

export function convertLength(
    value: number,
    fromUnit: string,
    toUnit: string
): number {
    const baseValue = value * lengthConversions[fromUnit];
    return baseValue / lengthConversions[toUnit];
}

export function convertWeight(
    value: number,
    fromUnit: string,
    toUnit: string
): number {
    const baseValue = value * weightConversions[fromUnit];
    return baseValue / weightConversions[toUnit];
}

export function convertTemperature(
    value: number,
    fromUnit: string,
    toUnit: string
): number {
    let celsius: number;

    // Convert to Celsius first
    if (fromUnit === "c") {
        celsius = value;
    } else if (fromUnit === "f") {
        celsius = ((value - 32) * 5) / 9;
    } else if (fromUnit === "k") {
        celsius = value - 273.15;
    } else {
        throw new Error("Invalid temperature unit");
    }

    // Convert from Celsius to target unit
    if (toUnit === "c") {
        return celsius;
    } else if (toUnit === "f") {
        return (celsius * 9) / 5 + 32;
    } else if (toUnit === "k") {
        return celsius + 273.15;
    } else {
        throw new Error("Invalid temperature unit");
    }
}

export function getUnits(type: string): { [key: string]: string } {
    switch (type) {
        case "length":
            return {
                ft: "Feet (ft)",
                m: "Meters (m)",
                cm: "Centimeters (cm)",
                in: "Inches (in)",
            };
        case "weight":
            return {
                kg: "Kilograms (kg)",
                g: "Grams (g)",
                lb: "Pounds (lb)",
                oz: "Ounces (oz)",
            };
        case "temperature":
            return {
                c: "Celsius (°C)",
                f: "Fahrenheit (°F)",
                k: "Kelvin (K)",
            };
        default:
            throw new Error("Invalid conversion type");
    }
}
