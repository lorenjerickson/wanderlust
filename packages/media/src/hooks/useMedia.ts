

export function useMedia() {
    const getAll = async () => {
        const response = await fetch(`http://localhost:3000/media`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    const getOne = async (id: string) => {
        const response = await fetch(`http://localhost:3000/media/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    const upsertOne = async (data: any) => {
        const response = await fetch(`http://localhost:3000/media/${data?.id}`, {
            method: data?.id === '0' ? 'POST' : 'PUT',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    const deleteOne = async (id: string) => {
        const response = await fetch(`http://localhost:3000/media/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    return {
        getAll,
        getOne,
        upsertOne,
        deleteOne,
    }
}