/**
 * 
 * ทำหน้าที่เป็นตัวแทนในการอ่านข้อมูลจากวัตถุซึ่งได้จากการสร้างด้วยตัวเอง, 
 * หรือใช้ JSON.parse(...), ระบบนี้เน้นเรื่องความปลอดภัยในการอ่านข้อมูลที่ได้รับ
 * เป็นหลักโดยผู้ใช้งานต้องระบุคำสั่งที่ชัดเจนเพื่อระบุข้อมูลที่ต้องการให้แน่ชัด
 * 
*/

/**
 * ระบบอ่านข้อมูลวัตถุ (JavaScript Object)
*/
const content = (data: unknown) =>
{
    catchUndefined ("<root>", data);
    catchNull ("<root>", data);
    catchNonObject ("<root>", data);

    const instance = data as Record<string, unknown>;
    const init = () => { return; };

    function catchUndefined (name: string, value: unknown)
    {
        if (typeof value === "undefined") 
        {
            throw new content.ErrorData (`${name} has invalid property value: undefined`);
        }
    }
    function catchNull (name: string, value: unknown)
    {
        if (typeof value === "object" && value === null)
        {
            throw new content.ErrorData (`${name} has invalid property value: null`);
        }
    }
    function catchNonString (name: string, value: unknown)
    {
        if (typeof value !== "string")
        {
            throw new content.ErrorType (`${name} has invalid property type: non-string`);
        }
    }
    function catchNonInteger (name: string, value: unknown)
    {
        if (typeof value !== "number")
        {
            throw new content.ErrorType (`${name} has invalid property type: non-number`);
        }
        if (!Number.isSafeInteger (value))
        {
            throw new content.ErrorData (`${name} has invalid property value: ${String (value)}, expecting integer`);
        }
    }
    function catchNonFloat (name: string, value: unknown)
    {
        if (typeof value !== "number")
        {
            throw new content.ErrorType (`${name} has invalid property type: non-number`);
        }
        if (!Number.isFinite (value))
        {
            throw new content.ErrorData (`${name} has invalid property value: ${String (value)}, expecting finite`);
        }
    }
    function catchNonObject (name: string, value: unknown)
    {
        if (typeof value !== "object" || Array.isArray (value))
        {
            throw new content.ErrorType (`${name} has invalid property type: non-object`);
        }
    }
    function catchNonArray (name: string, value: unknown)
    {
        if (typeof value !== "object" && !Array.isArray (value))
        {
            throw new content.ErrorType (`${name} has invalid property type: non-array`);
        }
    }

    /**
     * อ่านข้อมูลตัวเลขจำนวน จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {string}
    */
    init.requireString = (name: string) : string =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonString (name, value);
        
        return value as string;
    }
    /**
     * อ่านข้อมูลตัวเลขจำนวนเต็ม จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {number}
    */
    init.requireInteger = (name: string) : number =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonInteger (name, value);

        return value as number;
    }
    /**
     * อ่านข้อมูลตัวทศนิยม จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {number}
    */
    init.requireFloat = (name: string) : number =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonFloat (name, value);

        return value as number;
    }
    /**
     * อ่านข้อมูลวันที่เวลา จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {Date}
    */
    init.requireDate = (name: string) : Date =>
    {
        const value = instance [name];

        if (value instanceof Date)
        {
            return value;
        }
        catchUndefined (name, value);
        catchNull (name, value);
        catchNonInteger (name, value);

        return new Date (value as number);
    }
    /**
     * อ่านข้อมูลวัตถุ จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {Date}
    */
    init.requireObject = (name: string) : Record<string, unknown> =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonObject (name, value);

        return value as Record<string, unknown>;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวอักษร จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {string[]}
    */
    init.requireArrayString = (name: string) : string[] =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as string [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonString (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวเลขจำนวนเต็ม จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {number[]}
    */
    init.requireArrayInteger = (name: string) : number[] =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as number [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonInteger (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวเลขทศนิยม จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {number[]}
    */
    init.requireArrayFloat = (name: string) : number[] =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as number [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonFloat (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์วันที่ จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {Date[]}
    */
    init.requireArrayDate = (name: string) : Date[] =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as Date [];
        const result = typed.map ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonInteger (`${name}[${String (i)}]`, v);

            return new Date (v);
        });
        return result;
    }
    /**
     * อ่านข้อมูลอาร์เรย์วัตถุ จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้
     * 
     * @returns {Record<string, unknown>[]}
    */
    init.requireArrayObject = (name: string) : Record<string, unknown>[] =>
    {
        const value = instance [name];

        catchUndefined (name, value);
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as Record<string, unknown> [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonObject (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลตัวอักษร จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {string}
     * @returns {null}
    */
    init.requireStringOrNull = (name: string, initial: string | null = null) : string | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        catchUndefined (name, value);
        catchNonString (name, value);

        return value as string;
    }
    /**
     * อ่านข้อมูลตัวเลขจำนวนเต็ม จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {number}
     * @returns {null}
    */
    init.requireIntegerOrNull = (name: string, initial: number | null = null) : number | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        catchUndefined (name, value);
        catchNonInteger (name, value);

        return value as number;
    }
    /**
     * อ่านข้อมูลตัวเลขทศนิยม จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {number}
     * @returns {null}
    */
    init.requireFloatOrNull = (name: string, initial: number | null = null) : number | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        catchUndefined (name, value);
        catchNonFloat (name, value);

        return value as number;
    }
    /**
     * อ่านข้อมูลวันที่เวลา จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {Date}
     * @returns {null}
    */
    init.requireDateOrNull = (name: string, initial: Date | null = null) : Date | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        if (value instanceof Date)
        {
            return value;
        }
        catchUndefined (name, value);
        catchNonInteger (name, value);

        return new Date (value as number);
    }
    /**
     * อ่านข้อมูลวัตถุ จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {Record<string, unknown>}
     * @returns {null}
    */
    init.requireObjectOrNull = (name: string, initial: Record<string, unknown> | null = null) : Record<string, unknown> | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        catchUndefined (name, value);
        catchNonObject (name, value);

        return value as Record<string, unknown>;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวอักษร จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {string[]}
     * @returns {null}
    */
    init.requireArrayStringOrNull = (name: string, initial: string [] | null = null) : string [] | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        catchUndefined (name, value);
        catchNonArray (name, value);

        const typed = value as string [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonString (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวเลขจากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {number[]}
     * @returns {null}
    */
    init.requireArrayIntegerOrNull = (name: string, initial: number [] | null = null) : number [] | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        catchUndefined (name, value);
        catchNonArray (name, value);

        const typed = value as number [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonInteger (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวเลขทศนิยมจากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {number[]}
     * @returns {null}
    */
    init.requireArrayFloatOrNull = (name: string, initial: number [] | null = null) : number [] | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        catchUndefined (name, value);
        catchNonArray (name, value);

        const typed = value as number [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonFloat (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์วันที่จากชื่อที่กำหนดไว้
     * คำสั่งนี้บังคับว่าในชุดข้อมูลดังกล่าวต้องมีตัวแปรนี้ แต่อาจเป็น null ได้
     * 
     * @returns {Date[]}
     * @returns {null}
    */
    init.requireArrayDateOrNull = (name: string, initial: Date [] | null = null) : Date [] | null =>
    {
        const value = instance [name];

        if (typeof value === "object" && value === null)
        {
            return initial;
        }
        catchUndefined (name, value);
        catchNonArray (name, value);

        const typed = value as Date [];
        const result = typed.map ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonInteger (`${name}[${String (i)}]`, v);

            return new Date (v);
        });
        return result;
    }
    /**
     * อ่านข้อมูลตัวอักษร จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {string}
     * @returns {undefined}
    */
    init.optionalString = (name: string, undefinedValue ?: string) : string | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonString (name, value);
        
        return value as string;
    }
    /**
     * อ่านข้อมูลจำนวนเต็ม จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {number}
     * @returns {undefined}
    */
    init.optionalInteger = (name: string, undefinedValue ?: number) : number | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonInteger (name, value);

        return value as number;
    }
    /**
     * อ่านข้อมูลทศนิยม จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {number}
     * @returns {undefined}
    */
    init.optionalFloat = (name: string, undefinedValue ?: number) : number | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonFloat (name, value);

        return value as number;
    }
    /**
     * อ่านข้อมูลวันที่เวลา จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {Date}
     * @returns {undefined}
    */
    init.optionalDate = (name: string, undefinedValue ?: Date) : Date | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonInteger (name, value);

        return new Date (value as number);
    }
    /**
     * อ่านข้อมูลวัตถุ จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {Record<string, unknown>}
     * @returns {undefined}
    */
    init.optionalObject = (name: string, undefinedValue ?: Record<string, unknown>) : Record<string, unknown> | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonObject (name, value);

        return value as Record<string, unknown>;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวอักษร จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {string[]}
     * @returns {undefined}
    */
    init.optionalArrayString = (name: string, undefinedValue ?: string []) : string [] | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as string [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonString (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวเลขจำนวนเต็ม จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {number[]}
     * @returns {undefined}
    */
    init.optionalArrayInteger = (name: string, undefinedValue ?: number []) : number [] | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as number [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonInteger (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์ตัวเลขทศนิยม จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {number[]}
     * @returns {undefined}
    */
    init.optionalArrayFloat = (name: string, undefinedValue ?: number []) : number [] | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as number [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonFloat (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลอาร์เรย์วันที่ จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {Date[]}
     * @returns {undefined}
    */
    init.optionalArrayDate = (name: string, undefinedValue ?: Date []) : Date [] | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as Date [];
        const result = typed.map ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonInteger (`${name}[${String (i)}]`, v);

            return new Date (v);
        });
        return result;
    }
    /**
     * อ่านข้อมูลอาร์เรย์วัตถุ จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้
     * 
     * @returns {Record<string, unknown>[]}
     * @returns {undefined}
    */
    init.optionalArrayObject = (name: string, undefinedValue ?: Record<string, unknown> []) : Record<string, unknown> [] | undefined =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        catchNull (name, value);
        catchNonArray (name, value);

        const typed = value as Record<string, unknown> [];

        typed.forEach ((v, i) =>
        {
            catchUndefined (`${name}[${String (i)}]`, v);
            catchNull (`${name}[${String (i)}]`, v);
            catchNonObject (`${name}[${String (i)}]`, v);
        });
        return typed;
    }
    /**
     * อ่านข้อมูลตัวอักษร จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้ แต่อาจเป็น null ได้เช่นกัน
     * 
     * @returns {string}
     * @returns {undefined}
     * @returns {null}
    */
    init.optionalStringOrNull = (name: string, undefinedValue ?: string, nullValue ?: string) : string | undefined | null =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        if (typeof value === "object" && value === null)
        {
            return nullValue;
        }
        catchNonString (name, value);
        
        return value as string;
    }
    /**
     * อ่านข้อมูลตัวเลขจำนวนเต็ม จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้ แต่อาจเป็น null ได้เช่นกัน
     * 
     * @returns {number}
     * @returns {undefined}
     * @returns {null}
    */
    init.optionalIntegerOrNull = (name: string, undefinedValue ?: number, nullValue ?: number) : number | undefined | null =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        if (typeof value === "object" && value === null)
        {
            return nullValue;
        }
        catchNonInteger (name, value);

        return value as number;
    }
    /**
     * อ่านข้อมูลตัวเลขทศนิยม จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้ แต่อาจเป็น null ได้เช่นกัน
     * 
     * @returns {number}
     * @returns {undefined}
     * @returns {null}
    */
    init.optionalFloatOrNull = (name: string, undefinedValue ?: number, nullValue ?: number) : number | undefined | null =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        if (typeof value === "object" && value === null)
        {
            return nullValue;
        }
        catchNonFloat (name, value);

        return value as number;
    }
    /**
     * อ่านข้อมูลวันที่เวลา จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้ แต่อาจเป็น null ได้เช่นกัน
     * 
     * @returns {Date}
     * @returns {undefined}
     * @returns {null}
    */
    init.optionalDateOrNull = (name: string, undefinedValue ?: Date, nullValue ?: Date) : Date | undefined | null =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        if (typeof value === "object" && value === null)
        {
            return nullValue;
        }
        catchNonInteger (name, value);

        return new Date (value as number);
    }
    /**
     * อ่านข้อมูลวัตถุ จากชื่อที่กำหนดไว้
     * คำสั่งนี้ไม่บังคับว่าในชุดข้อมูลดังกล่าวอาจมีตัวแปรนี้ หรือไม่มีก็ได้ แต่อาจเป็น null ได้เช่นกัน
     * 
     * @returns {Record<string, unknown>}
     * @returns {undefined}
     * @returns {null}
    */
    init.optionalObjectOrNull = (name: string, undefinedValue ?: Record<string, unknown>, nullValue ?: Record<string, unknown>) : Record<string, unknown> | undefined | null =>
    {
        const value = instance [name];

        if (typeof value === "undefined")
        {
            return undefinedValue;
        }
        if (typeof value === "object" && value === null)
        {
            return nullValue;
        }
        catchNonObject (name, value);

        return value as Record<string, unknown>;
    }
    return init;
}
/**
 * ตรวจสอบข้อผิดพลาดที่เกิดขึ้น
*/
content.isError = function (error: unknown)
{
    return error instanceof content.ErrorUnavailable ||
            error instanceof content.ErrorData ||
            error instanceof content.ErrorType;
}
/**
 * ตรวจสอบข้อผิดพลาดที่เกิดขึ้นว่าเป็นปรเถท `ErrorData` หรือไม่
*/
content.isErrorData = function (error: unknown)
{
    return error instanceof content.ErrorData;
}
/**
 * ตรวจสอบข้อผิดพลาดที่เกิดขึ้นว่าเป็นปรเถท `ErrorType` หรือไม่
*/
content.isErrorType = function (error: unknown)
{
    return error instanceof content.ErrorType;
}
/**
 * ข้อผิดพลาดเนื่องจากไม่สามารถเข้าถึงข้อมูลได้
*/
content.ErrorUnavailable = class extends Error {};
/**
 * ข้อผิดพลาดเนื่องจากข้อมูลไม่ถูกต้อง
*/
content.ErrorData = class extends Error {};
/**
 * ข้อผิดพลาดเนื่องจากข้อมูลประเภทไม่ถูกต้องตามที่ระบบต้องการ
*/
content.ErrorType = class extends Error {};


export default content;