export declare class CheckoutCartDto {
    shippingAddress?: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        phone: string;
    };
    billingAddress?: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        phone: string;
    };
    paymentMethod?: string;
    tax?: number;
    shipping?: number;
    notes?: string;
}
