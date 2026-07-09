/**
 * 
 * ระบบจัดการกิจกรรม 
 * ให้ระบบอื่นสามารถติดตามการทำงานของระบบดังกล่าวได้
 * 
*/
const content = function<A> ()
{
    type callback = (argument: A) => void;
    const listener: callback[] = [];
    const instance = {
        add: (value: callback) => { listener.push (value); },
        remove: (value: callback) => 
        {
            const index = listener.indexOf (value);
            const removed = index != -1;

            if (removed) { listener.splice (index, 1); }
            return removed;
        },
        clear: () => 
        { 
            listener.length =  0; 
        },
        emit: (argument: A) => 
        { 
            listener.forEach ((c) => { c (argument); });
        }
    };
    Object.freeze (instance);
    return instance;
}
Object.freeze (content);
export default content;