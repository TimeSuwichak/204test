
const content = function<T> ()
{
    let count = 0;
    let capacity = 4;
    const data: T[] = [];

    data.length = capacity;

    return {
        add: (value: T) =>
        {
            if ((count + 1) > capacity)
            {
                capacity = Math.trunc (capacity * 4);
                data.length = capacity;
            }
            data [count] = value;
            count += 1;
        },
        remove: (value: T) =>
        {
            for (let index = 0; index < count; index ++)
            {
                if (data [index] == value)
                {
                    count -= 1;
                    data.splice (index, 1);
                    return;
                }
            }
        },
        removeAt (index: number)
        {
            data.splice (index, 1);
            return;
        },
        clear: () =>
        {
            count = 0;
            return;
        },
        contain: (value: T) =>
        {
            for (let index = 0; index < count; index ++)
            {
                if (data [index] == value)
                {
                    return true;
                }
            }
            return false;
        }
    };
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;