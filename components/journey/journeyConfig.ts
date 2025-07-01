import { AppScreen } from '../../types';

export interface JourneyStep {
  targetSelector?: string;
  title: string;
  content: string;
  placement: 'center' | 'top' | 'bottom' | 'left' | 'right';
  screen?: AppScreen;
  action?: 'open_okr_creator' | 'open_user_creator' | 'open_team_creator';
  awaitsClose?: 'okr_creator' | 'user_creator' | 'team_creator';
}

export const journeySteps: JourneyStep[] = [
  {
    title: '¡Bienvenido al Viaje OKR!',
    content: 'Este tour guiado te ayudará a configurar tus primeros OKRs desde cero. Empecemos por organizar tu espacio de trabajo.',
    placement: 'center',
  },
  {
    targetSelector: '#sidebar-settings',
    title: '1. Ir a Configuración',
    content: 'Primero, vayamos a la página de Configuración para gestionar tus equipos y usuarios.',
    placement: 'right',
    screen: 'settings',
  },
  {
    targetSelector: '#settings-add-team',
    title: '2. Crear un Equipo',
    content: 'Haz clic aquí para crear tu primer equipo. Los equipos son esenciales para organizar el trabajo.',
    placement: 'bottom',
    screen: 'settings',
    action: 'open_team_creator',
  },
  {
    targetSelector: '#team-creator-modal',
    title: 'Nombra a tu equipo',
    content: 'Dale un nombre a tu equipo y haz clic en "Create Team". Cierra esta ventana cuando termines para continuar.',
    placement: 'right',
    screen: 'settings',
    awaitsClose: 'team_creator',
  },
  {
    targetSelector: '#settings-add-user',
    title: '3. Añadir un Usuario',
    content: 'Ahora, añadamos un miembro a tu organización. Puedes asignarlo al equipo que acabas de crear.',
    placement: 'bottom',
    screen: 'settings',
    action: 'open_user_creator',
  },
  {
    targetSelector: '#user-creator-modal',
    title: 'Añadir un nuevo miembro',
    content: 'Completa los detalles del usuario. Al terminar, cierra esta ventana para continuar con el tour.',
    placement: 'right',
    screen: 'settings',
    awaitsClose: 'user_creator',
  },
  {
    targetSelector: '#sidebar-company',
    title: '4. OKRs de la Compañía',
    content: '¡Genial! Con tu equipo configurado, es hora de definir tus metas de alto nivel.',
    placement: 'right',
    screen: 'company',
  },
  {
    targetSelector: '#header-new-okr',
    title: '5. Crear un Objetivo de Compañía',
    content: 'Haz clic aquí para crear tu primer objetivo para toda la compañía. Debería ser una meta grande y ambiciosa.',
    placement: 'left',
    screen: 'company',
    action: 'open_okr_creator',
  },
  {
    targetSelector: '#okr-creator-modal',
    title: 'Define tu Objetivo',
    content: 'Describe el objetivo principal y sus Resultados Clave medibles. Alínealo con "None" ya que es un objetivo de nivel superior. Cierra la ventana al terminar.',
    placement: 'right',
    screen: 'company',
    awaitsClose: 'okr_creator',
  },
  {
    targetSelector: '#fab-new-okr',
    title: '6. Crear un Objetivo de Equipo',
    content: 'Ahora, creemos un objetivo de equipo más específico que se alinee con la meta de la compañía que acabas de establecer.',
    placement: 'left',
    screen: 'company',
    action: 'open_okr_creator',
  },
  {
    targetSelector: '#okr-creator-modal',
    title: 'Define el Objetivo del Equipo',
    content: 'Asegúrate de asignar el equipo correcto como "Owner" y selecciona el objetivo de la compañía como "Parent Objective". Cierra al finalizar.',
    placement: 'right',
    screen: 'company',
    awaitsClose: 'okr_creator',
  },
  {
    targetSelector: '#sidebar-dashboard',
    title: '7. Volver al Dashboard',
    content: '¡Excelente! Puedes seguir todos tus OKRs relevantes desde el dashboard. Vamos a echar un vistazo.',
    placement: 'right',
    screen: 'dashboard',
  },
  {
    title: '¡Viaje Completado!',
    content: '¡Felicitaciones! Has configurado con éxito tus primeros OKRs. Ahora puedes explorar la aplicación, crear más objetivos y seguir tu progreso.',
    placement: 'center',
  }
];
