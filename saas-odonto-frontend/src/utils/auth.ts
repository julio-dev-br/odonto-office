export interface UserSession {
  professionalId: string | null;
  tenantId: string;
  email: string | null;
  role: string | null;
}

export function getActiveSession(): UserSession {
  const token = localStorage.getItem('@OdontoOffice:token');
  const fallbackTenantId = localStorage.getItem('@OdontoOffice:tenantId') || '1';

  if (!token) {
    return { professionalId: null, tenantId: fallbackTenantId, email: null, role: null };
  }

  try {
    // Divide o Token JWT e extrai o Payload (posição 1)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    return {
      professionalId: payload.professionalId || payload.professional_id || (payload.role === 'ADMIN' ? '1' : payload.sub?.toString()),
      tenantId: payload.tenantId ? payload.tenantId.toString() : fallbackTenantId,
      email: payload.email || null,
      role: payload.role || null
    };

  } catch (e) {
    console.error('Erro crítico ao decodificar token de sessão ativa:', e);
    return { professionalId: null, tenantId: fallbackTenantId, email: null, role: null };
  }
}
