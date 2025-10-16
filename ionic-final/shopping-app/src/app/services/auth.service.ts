import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
         signOut, updateProfile, User, onAuthStateChanged } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    // Observar cambios en el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Registro de nuevo usuario
  async register(email: string, password: string, displayName: string): Promise<any> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Actualizar perfil con nombre
      if (credential.user) {
        await updateProfile(credential.user, { displayName });
      }
      
      return { success: true, user: credential.user };
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Login
  async login(email: string, password: string): Promise<any> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: credential.user };
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Logout
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // Actualizar perfil
  async updateUserProfile(displayName?: string, photoURL?: string): Promise<any> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return { success: false, error: 'No hay usuario autenticado' };
      }

      const updates: any = {};
      if (displayName) updates.displayName = displayName;
      if (photoURL) updates.photoURL = photoURL;

      await updateProfile(user, updates);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  // Mensajes de error en español
  private getErrorMessage(code: string): string {
    const errors: any = {
      'auth/email-already-in-use': 'El email ya está registrado',
      'auth/invalid-email': 'Email inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos, intenta más tarde'
    };
    return errors[code] || 'Error en la autenticación';
  }
}